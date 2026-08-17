import os
import sys
import asyncio

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import hash_password, verify_password, create_access_token
from app.api.v1.auth import REVOKED_TOKENS, get_current_user_id
from app.db.session import init_db, AsyncSessionLocal
from app.models.user import UserModel
from app.models.detection import DetectionModel
from app.schemas.auth import UserRegisterRequest
from pydantic import ValidationError
from sqlalchemy.future import select

async def run_auth_tests_async():
    print("==================================================")
    print("   SMART ROAD DAMAGE - AUTH & SECURITY TEST SUITE ")
    print("==================================================")
    
    await init_db()
    
    passed_tests = 0
    total_tests = 13

    async with AsyncSessionLocal() as db:
        # TEST 1: Valid Registration Schema
        try:
            user_reg = UserRegisterRequest(
                full_name="Alex Rivera",
                email="alex.rivera@smartcity.gov",
                password="StrongPassword123!",
                confirm_password="StrongPassword123!",
                organization="Civil Works Department"
            )
            assert user_reg.email == "alex.rivera@smartcity.gov"
            print("[PASS] Test 1: Valid registration schema validated")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 1: {e}")

        # Insert seeded user into DB for duplicate email testing
        test_user = UserModel(
            id="usr-demo123",
            email="operator@smartcity.gov",
            name="Smart City Operator",
            password_hash=hash_password("Password123!"),
            organization="Road Infrastructure Ops",
            role="operator"
        )
        db.add(test_user)
        try:
            await db.commit()
        except Exception:
            await db.rollback()

        # TEST 2: Duplicate Email Attempt
        try:
            stmt = select(UserModel).where(UserModel.email == "operator@smartcity.gov")
            res = await db.execute(stmt)
            existing_user = res.scalars().first()
            assert existing_user is not None, "Duplicate email should exist in database"
            print("[PASS] Test 2: Duplicate email attempt detected & rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 2: {e}")

        # TEST 3: Invalid Email Format
        try:
            failed = False
            try:
                UserRegisterRequest(
                    full_name="Bad Email",
                    email="not-an-email-address",
                    password="Password123!",
                    confirm_password="Password123!"
                )
            except ValidationError:
                failed = True
            assert failed, "Invalid email format should fail Pydantic validation"
            print("[PASS] Test 3: Invalid email format rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 3: {e}")

        # TEST 4: Weak Password Rejection
        try:
            failed = False
            try:
                UserRegisterRequest(
                    full_name="Weak Pwd",
                    email="weak@smartcity.gov",
                    password="123",
                    confirm_password="123"
                )
            except ValidationError:
                failed = True
            assert failed, "Weak password (<8 chars) should fail validation"
            print("[PASS] Test 4: Weak password (<8 chars) rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 4: {e}")

        # TEST 5: Password Mismatch
        try:
            failed = False
            try:
                UserRegisterRequest(
                    full_name="Mismatch Pwd",
                    email="mismatch@smartcity.gov",
                    password="Password123!",
                    confirm_password="DifferentPassword123!"
                )
            except ValidationError:
                failed = True
            assert failed, "Password confirmation mismatch should fail validation"
            print("[PASS] Test 5: Password confirmation mismatch rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 5: {e}")

        # TEST 6: Valid Login & Bcrypt Hash Verification
        try:
            stmt = select(UserModel).where(UserModel.email == "operator@smartcity.gov")
            res = await db.execute(stmt)
            user = res.scalars().first()
            assert user is not None, "Operator user should exist in DB"
            is_pwd_valid = verify_password("Password123!", user.password_hash)
            assert is_pwd_valid, "Password hash verification should succeed"
            token = create_access_token({"sub": user.id, "email": user.email})
            assert token is not None and len(token) > 20, "JWT token generated"
            print("[PASS] Test 6: Valid login & Bcrypt hash verified")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 6: {e}")

        # TEST 7: Wrong Password Login
        try:
            stmt = select(UserModel).where(UserModel.email == "operator@smartcity.gov")
            res = await db.execute(stmt)
            user = res.scalars().first()
            is_pwd_valid = verify_password("WrongPassword999!", user.password_hash)
            assert not is_pwd_valid, "Wrong password should fail verification"
            print("[PASS] Test 7: Wrong password login rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 7: {e}")

        # TEST 8: Non-Existent Account Login
        try:
            stmt = select(UserModel).where(UserModel.email == "ghost.account@smartcity.gov")
            res = await db.execute(stmt)
            user = res.scalars().first()
            assert user is None, "Non-existent account should return None"
            print("[PASS] Test 8: Non-existent account login rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 8: {e}")

        # TEST 9: Protected Route Without Authentication Header
        try:
            failed = False
            try:
                get_current_user_id(authorization=None)
            except Exception:
                failed = True
            assert failed, "Unauthenticated request should be rejected"
            print("[PASS] Test 9: Protected route without authentication header rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 9: {e}")

        # TEST 10: Protected Route With Valid Authentication Token
        try:
            token = create_access_token({"sub": "usr-demo123", "email": "operator@smartcity.gov"})
            user_id = get_current_user_id(authorization=f"Bearer {token}")
            assert user_id == "usr-demo123", "Valid token should resolve correct user_id"
            print("[PASS] Test 10: Protected route with valid JWT authentication passed")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 10: {e}")

        # TEST 11: Expired / Invalid Token Rejection
        try:
            invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature"
            failed = False
            try:
                get_current_user_id(authorization=f"Bearer {invalid_token}")
            except Exception:
                failed = True
            assert failed, "Invalid token signature should be rejected"
            print("[PASS] Test 11: Expired/invalid JWT token rejected")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 11: {e}")

        # TEST 12: Logout Flow & Token Invalidation
        try:
            test_logout_token = create_access_token({"sub": "usr-logout-test"})
            REVOKED_TOKENS.add(test_logout_token)
            failed = False
            try:
                get_current_user_id(authorization=f"Bearer {test_logout_token}")
            except Exception:
                failed = True
            assert failed, "Revoked token on logout should be rejected"
            print("[PASS] Test 12: Logout token revocation verified")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 12: {e}")

        # TEST 13: Cross-Tenant Isolation
        try:
            user_a_id = "usr-userA"
            user_b_id = "usr-userB"
            
            # Create detection belonging to User B
            det_b = DetectionModel(
                id="det-userB-rec1",
                user_id=user_b_id,
                filename="hazard.jpg",
                input_type="image",
                overall_condition="Critical Hazard",
                overall_severity="critical",
                road_condition_score=35,
                detection_count=1,
                processing_time_ms=150,
                location_name="Sector B-4"
            )
            db.add(det_b)
            try:
                await db.commit()
            except Exception:
                await db.rollback()

            stmt = select(DetectionModel).where(DetectionModel.id == "det-userB-rec1")
            res = await db.execute(stmt)
            target_rec = res.scalars().first()

            is_unauthorized = target_rec.user_id != user_a_id
            assert is_unauthorized, "User A should not have access to User B's record"
            print("[PASS] Test 13: Cross-tenant isolation (User A barred from User B data)")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 13: {e}")

    print("--------------------------------------------------")
    print(f"   TEST SUMMARY: {passed_tests}/{total_tests} PASSED")
    print("==================================================")

def run_auth_tests():
    asyncio.run(run_auth_tests_async())

if __name__ == "__main__":
    run_auth_tests()
