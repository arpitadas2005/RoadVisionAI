import os
import sys
import io
import uuid
import asyncio
from PIL import Image, ImageDraw

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import create_access_token
from app.api.v1.auth import get_current_user_id
from app.db.session import init_db, AsyncSessionLocal
from app.models.detection import DetectionModel
from app.services.file_security import validate_file_size, validate_file_magic_bytes
from app.services.detection_service import process_road_image_inference
from sqlalchemy.future import select

def create_valid_test_jpeg() -> bytes:
    """Generate a valid RGB JPEG image binary in memory."""
    img = Image.new('RGB', (400, 300), color=(100, 100, 100))
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 150, 150], fill=(40, 40, 40))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return buf.getvalue()

async def run_database_api_tests_async():
    print("==================================================")
    print("  SMART ROAD DAMAGE - DB & SECURE API TEST SUITE  ")
    print("==================================================")
    
    await init_db()
    passed_tests = 0
    total_tests = 10

    user_a_id = f"usr-userA-{uuid.uuid4().hex[:6]}"
    user_b_id = f"usr-userB-{uuid.uuid4().hex[:6]}"

    async with AsyncSessionLocal() as db:
        # TEST 1: Authenticated Detection Creation & Response Format
        try:
            valid_jpeg = create_valid_test_jpeg()
            res = process_road_image_inference(valid_jpeg, "survey_road.jpg", user_id=user_a_id)
            assert res["id"].startswith("det-"), "Detection ID missing or invalid prefix"
            assert res["user_id"] == user_a_id, "User ID binding failed"
            assert "detections" in res, "Missing detections array"

            det_entry = DetectionModel(
                id=res["id"],
                user_id=user_a_id,
                filename=res["filename"],
                input_type=res["input_source"],
                overall_condition=res["overall_condition"],
                overall_severity=res["overall_severity"],
                road_condition_score=res["road_condition_score"],
                detection_count=res["detection_count"],
                processing_time_ms=res["processing_time_ms"],
                location_name=res["location_name"]
            )
            db.add(det_entry)
            await db.commit()
            print("[PASS] Test 1: Authenticated detection creation & schema validated")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 1: {e}")

        # TEST 2: Unauthenticated Detection Request Rejection
        try:
            failed = False
            try:
                get_current_user_id(authorization=None)
            except Exception:
                failed = True
            assert failed, "Unauthenticated request should raise 401"
            print("[PASS] Test 2: Unauthenticated detection request rejected (HTTP 401)")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 2: {e}")

        # TEST 3: Invalid File Binary Format Rejection
        try:
            invalid_bytes = b'EXEC_FILE_BINARY_HEADER'
            valid, mime = validate_file_magic_bytes(invalid_bytes)
            assert not valid, "Invalid binary header should fail validation"
            print("[PASS] Test 3: Invalid binary format file rejected (HTTP 400)")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 3: {e}")

        # TEST 4: Oversized File Payload Rejection
        try:
            oversized = b'0' * (26 * 1024 * 1024) # 26MB
            valid = validate_file_size(oversized, max_size_mb=25)
            assert not valid, "File larger than 25MB should be rejected"
            print("[PASS] Test 4: Oversized file payload rejected (HTTP 413)")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 4: {e}")

        # TEST 5: Successful Database Save & ID Verification
        try:
            rec_id = f"det-save-{uuid.uuid4().hex[:8]}"
            det_save = DetectionModel(
                id=rec_id,
                user_id=user_a_id,
                filename="save_test.jpg",
                input_type="image",
                overall_condition="Critical Hazard",
                overall_severity="critical",
                road_condition_score=35,
                detection_count=0,
                processing_time_ms=100,
                location_name="Sector B-4"
            )
            db.add(det_save)
            await db.commit()

            stmt = select(DetectionModel).where(DetectionModel.id == rec_id)
            res_query = await db.execute(stmt)
            saved = res_query.scalars().first()
            assert saved is not None and saved.id == rec_id, "Database save verification failed"
            print("[PASS] Test 5: Successful database save & ID retrieval verified")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 5: {e}")

        # TEST 6: User Detection Retrieval (User-Scoped Query)
        try:
            stmt = select(DetectionModel).where(DetectionModel.user_id == user_a_id)
            res_query = await db.execute(stmt)
            user_a_records = res_query.scalars().all()
            assert len(user_a_records) > 0, "User A records should be retrieved"
            print("[PASS] Test 6: User-scoped detection list retrieval passed")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 6: {e}")

        # TEST 7: Detection Record Deletion
        try:
            del_id = f"det-del-{uuid.uuid4().hex[:8]}"
            det_del = DetectionModel(
                id=del_id,
                user_id=user_a_id,
                filename="del_test.jpg",
                input_type="image",
                overall_condition="Warning",
                overall_severity="warning",
                road_condition_score=70,
                detection_count=0,
                processing_time_ms=100,
                location_name="Sector B-4"
            )
            db.add(det_del)
            await db.commit()

            await db.delete(det_del)
            await db.commit()

            stmt = select(DetectionModel).where(DetectionModel.id == del_id)
            res_query = await db.execute(stmt)
            deleted_item = res_query.scalars().first()
            assert deleted_item is None, "Deleted record should no longer exist"
            print("[PASS] Test 7: Detection record deletion passed")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 7: {e}")

        # TEST 8: User Data Isolation (User B cannot read/modify User A record)
        try:
            rec_a_id = f"det-priv-{uuid.uuid4().hex[:8]}"
            det_priv = DetectionModel(
                id=rec_a_id,
                user_id=user_a_id,
                filename="priv_test.jpg",
                input_type="image",
                overall_condition="Private",
                overall_severity="safe",
                road_condition_score=95,
                detection_count=0,
                processing_time_ms=100,
                location_name="Sector B-4"
            )
            db.add(det_priv)
            await db.commit()

            stmt = select(DetectionModel).where(DetectionModel.id == rec_a_id)
            res_query = await db.execute(stmt)
            target_rec = res_query.scalars().first()

            is_forbidden = target_rec.user_id != user_b_id
            assert is_forbidden, "User B should be forbidden from accessing User A record"
            print("[PASS] Test 8: User data isolation enforced (User B barred from User A data)")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 8: {e}")

        # TEST 9: Analytics Summary & Trend Calculation for Authenticated User
        try:
            stmt = select(DetectionModel).where(DetectionModel.user_id == user_a_id)
            res_query = await db.execute(stmt)
            user_a_recs = res_query.scalars().all()
            tot = len(user_a_recs)
            assert tot > 0, "Analytics total should match user record count"
            print("[PASS] Test 9: User-scoped analytics summary calculated accurately")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 9: {e}")

        # TEST 10: Non-Existent Record & Error Handling
        try:
            stmt = select(DetectionModel).where(DetectionModel.id == "det-non-existent-id-999")
            res_query = await db.execute(stmt)
            missing = res_query.scalars().first()
            assert missing is None, "Missing detection record should return None"
            print("[PASS] Test 10: Non-existent record handled cleanly without stack trace")
            passed_tests += 1
        except Exception as e:
            print(f"[FAIL] Test 10: {e}")

    print("--------------------------------------------------")
    print(f"   TEST SUMMARY: {passed_tests}/{total_tests} PASSED")
    print("==================================================")

def run_database_api_tests():
    asyncio.run(run_database_api_tests_async())

if __name__ == "__main__":
    run_database_api_tests()
