"""
HILLIA Admin API Tests
Tests for admin authentication, questionnaire management, contact management, and statistics
"""

import pytest
import requests
import os
import base64
import hashlib
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_USERNAME = "hillia_admin"
ADMIN_PASSWORD = "HilliaAdmin2024"
WRONG_PASSWORD = "wrongpassword"

def get_auth_header(username, password):
    """Generate Basic Auth header"""
    credentials = f"{username}:{password}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {"Authorization": f"Basic {encoded}"}


class TestHealthCheck:
    """Basic API health check tests"""
    
    def test_api_root_returns_200(self):
        """Test that API root endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "HILLIA" in data["message"]
        print(f"SUCCESS: API root returns: {data}")


class TestAdminAuthentication:
    """Admin authentication and rate limiting tests"""
    
    def test_admin_auth_verify_with_valid_credentials(self):
        """Test admin auth verification with correct credentials"""
        headers = get_auth_header(ADMIN_USERNAME, ADMIN_PASSWORD)
        response = requests.post(f"{BASE_URL}/api/admin/auth/verify", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "authenticated"
        assert data["username"] == ADMIN_USERNAME
        print(f"SUCCESS: Admin auth verified - {data}")
    
    def test_admin_auth_verify_with_invalid_credentials(self):
        """Test admin auth verification with wrong credentials"""
        headers = get_auth_header(ADMIN_USERNAME, WRONG_PASSWORD)
        response = requests.post(f"{BASE_URL}/api/admin/auth/verify", headers=headers)
        
        assert response.status_code == 401
        print("SUCCESS: Invalid credentials correctly rejected with 401")
    
    def test_admin_auth_verify_without_credentials(self):
        """Test admin auth verification without any credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/auth/verify")
        
        assert response.status_code == 401
        print("SUCCESS: Missing credentials correctly rejected with 401")
    
    def test_admin_protected_endpoint_requires_auth(self):
        """Test that admin endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        
        assert response.status_code == 401
        print("SUCCESS: Admin stats endpoint requires authentication")


class TestAdminStats:
    """Admin statistics endpoint tests"""
    
    def test_get_admin_stats_authenticated(self):
        """Test getting admin stats with valid credentials"""
        headers = get_auth_header(ADMIN_USERNAME, ADMIN_PASSWORD)
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify questionnaire stats structure
        assert "questionnaire" in data
        assert "total" in data["questionnaire"]
        assert "by_status" in data["questionnaire"]
        assert "unreviewed" in data["questionnaire"]["by_status"]
        assert "reviewed" in data["questionnaire"]["by_status"]
        assert "archived" in data["questionnaire"]["by_status"]
        assert "contact_consent" in data["questionnaire"]
        
        # Verify contact stats structure
        assert "contact" in data
        assert "total" in data["contact"]
        assert "by_status" in data["contact"]
        assert "new" in data["contact"]["by_status"]
        assert "reviewed" in data["contact"]["by_status"]
        assert "archived" in data["contact"]["by_status"]
        
        # Verify percentage fields exist
        assert "count" in data["questionnaire"]["by_status"]["unreviewed"]
        assert "percentage" in data["questionnaire"]["by_status"]["unreviewed"]
        
        print(f"SUCCESS: Admin stats returned - Questionnaire total: {data['questionnaire']['total']}, Contact total: {data['contact']['total']}")


class TestQuestionnaireSubmission:
    """Public questionnaire submission tests"""
    
    def test_submit_questionnaire_with_consent(self):
        """Test submitting a questionnaire response"""
        payload = {
            "session_id": f"test_session_{datetime.now().timestamp()}",
            "consent": True,
            "sections": {
                "lifestyle": {
                    "q1": "Option A",
                    "q2": ["Option B", "Option C"]
                }
            },
            "free_text": {
                "q3": "This is a test free text response"
            },
            "wants_contact": False
        }
        
        response = requests.post(f"{BASE_URL}/api/questionnaire", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "response_id" in data
        assert "timestamp" in data
        assert data["status"] == "received"
        print(f"SUCCESS: Questionnaire submitted - ID: {data['response_id']}")
        return data["response_id"]
    
    def test_submit_questionnaire_without_consent_fails(self):
        """Test that questionnaire submission without consent fails"""
        payload = {
            "session_id": "test_session_no_consent",
            "consent": False,
            "sections": {}
        }
        
        response = requests.post(f"{BASE_URL}/api/questionnaire", json=payload)
        
        assert response.status_code == 400
        print("SUCCESS: Questionnaire without consent correctly rejected")


class TestAdminQuestionnaireManagement:
    """Admin questionnaire management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup auth headers"""
        self.headers = get_auth_header(ADMIN_USERNAME, ADMIN_PASSWORD)
    
    def test_get_questionnaire_list(self):
        """Test getting list of questionnaire responses"""
        response = requests.get(f"{BASE_URL}/api/admin/questionnaire", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Retrieved {len(data)} questionnaire responses")
        
        if len(data) > 0:
            # Verify response structure
            first_response = data[0]
            assert "response_id" in first_response
            assert "timestamp" in first_response
            assert "status" in first_response
            print(f"SUCCESS: First response ID: {first_response['response_id']}, Status: {first_response['status']}")
    
    def test_get_questionnaire_list_with_status_filter(self):
        """Test filtering questionnaire responses by status"""
        response = requests.get(f"{BASE_URL}/api/admin/questionnaire?status=unreviewed", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # All returned items should have unreviewed status
        for item in data:
            assert item["status"] == "unreviewed"
        
        print(f"SUCCESS: Retrieved {len(data)} unreviewed questionnaire responses")
    
    def test_get_single_questionnaire_response(self):
        """Test getting a single questionnaire response by ID"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/questionnaire", headers=self.headers)
        assert list_response.status_code == 200
        responses = list_response.json()
        
        if len(responses) == 0:
            pytest.skip("No questionnaire responses available for testing")
        
        response_id = responses[0]["response_id"]
        
        # Get single response
        response = requests.get(f"{BASE_URL}/api/admin/questionnaire/{response_id}", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["response_id"] == response_id
        assert "sections" in data
        assert "status" in data
        print(f"SUCCESS: Retrieved questionnaire response: {response_id}")
    
    def test_get_nonexistent_questionnaire_returns_404(self):
        """Test that getting a non-existent questionnaire returns 404"""
        response = requests.get(f"{BASE_URL}/api/admin/questionnaire/nonexistent-id-12345", headers=self.headers)
        
        assert response.status_code == 404
        print("SUCCESS: Non-existent questionnaire correctly returns 404")
    
    def test_update_questionnaire_status(self):
        """Test updating questionnaire response status"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/questionnaire", headers=self.headers)
        responses = list_response.json()
        
        if len(responses) == 0:
            pytest.skip("No questionnaire responses available for testing")
        
        response_id = responses[0]["response_id"]
        original_status = responses[0]["status"]
        
        # Update status to reviewed
        new_status = "reviewed" if original_status != "reviewed" else "unreviewed"
        response = requests.patch(
            f"{BASE_URL}/api/admin/questionnaire/{response_id}?status={new_status}",
            headers=self.headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "updated"
        
        # Verify the update persisted
        verify_response = requests.get(f"{BASE_URL}/api/admin/questionnaire/{response_id}", headers=self.headers)
        assert verify_response.status_code == 200
        assert verify_response.json()["status"] == new_status
        
        print(f"SUCCESS: Updated questionnaire status from {original_status} to {new_status}")
        
        # Restore original status
        requests.patch(
            f"{BASE_URL}/api/admin/questionnaire/{response_id}?status={original_status}",
            headers=self.headers
        )
    
    def test_update_questionnaire_internal_notes(self):
        """Test adding internal notes to questionnaire response"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/questionnaire", headers=self.headers)
        responses = list_response.json()
        
        if len(responses) == 0:
            pytest.skip("No questionnaire responses available for testing")
        
        response_id = responses[0]["response_id"]
        test_note = f"TEST_NOTE_{datetime.now().timestamp()}"
        
        # Update notes
        response = requests.patch(
            f"{BASE_URL}/api/admin/questionnaire/{response_id}?internal_notes={test_note}",
            headers=self.headers
        )
        
        assert response.status_code == 200
        
        # Verify the update persisted
        verify_response = requests.get(f"{BASE_URL}/api/admin/questionnaire/{response_id}", headers=self.headers)
        assert verify_response.status_code == 200
        assert verify_response.json()["internal_notes"] == test_note
        
        print(f"SUCCESS: Added internal notes to questionnaire: {test_note}")


class TestContactSubmission:
    """Public contact submission tests"""
    
    def test_submit_contact_with_consent(self):
        """Test submitting a contact form"""
        payload = {
            "name": "TEST_Contact User",
            "reason": "Testing the contact form",
            "city": "Test City",
            "preferred_contact": "email",
            "email": "test@example.com",
            "phone": "+1234567890",
            "consent": True
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "submission_id" in data
        assert "timestamp" in data
        print(f"SUCCESS: Contact submitted - ID: {data['submission_id']}")
        return data["submission_id"]
    
    def test_submit_contact_without_consent_fails(self):
        """Test that contact submission without consent fails"""
        payload = {
            "name": "Test User",
            "reason": "Testing",
            "consent": False
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        assert response.status_code == 400
        print("SUCCESS: Contact without consent correctly rejected")


class TestAdminContactManagement:
    """Admin contact management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup auth headers"""
        self.headers = get_auth_header(ADMIN_USERNAME, ADMIN_PASSWORD)
    
    def test_get_contact_list(self):
        """Test getting list of contact submissions"""
        response = requests.get(f"{BASE_URL}/api/admin/contact", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Retrieved {len(data)} contact submissions")
        
        if len(data) > 0:
            # Verify response structure
            first_submission = data[0]
            assert "submission_id" in first_submission
            assert "name" in first_submission
            assert "reason" in first_submission
            assert "status" in first_submission
            print(f"SUCCESS: First submission - Name: {first_submission['name']}, Status: {first_submission['status']}")
    
    def test_get_contact_list_with_status_filter(self):
        """Test filtering contact submissions by status"""
        response = requests.get(f"{BASE_URL}/api/admin/contact?status=new", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # All returned items should have new status
        for item in data:
            assert item["status"] == "new"
        
        print(f"SUCCESS: Retrieved {len(data)} new contact submissions")
    
    def test_get_single_contact_submission(self):
        """Test getting a single contact submission by ID"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/contact", headers=self.headers)
        assert list_response.status_code == 200
        submissions = list_response.json()
        
        if len(submissions) == 0:
            pytest.skip("No contact submissions available for testing")
        
        submission_id = submissions[0]["submission_id"]
        
        # Get single submission
        response = requests.get(f"{BASE_URL}/api/admin/contact/{submission_id}", headers=self.headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["submission_id"] == submission_id
        assert "name" in data
        assert "reason" in data
        print(f"SUCCESS: Retrieved contact submission: {submission_id}")
    
    def test_get_nonexistent_contact_returns_404(self):
        """Test that getting a non-existent contact returns 404"""
        response = requests.get(f"{BASE_URL}/api/admin/contact/nonexistent-id-12345", headers=self.headers)
        
        assert response.status_code == 404
        print("SUCCESS: Non-existent contact correctly returns 404")
    
    def test_update_contact_status(self):
        """Test updating contact submission status"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/contact", headers=self.headers)
        submissions = list_response.json()
        
        if len(submissions) == 0:
            pytest.skip("No contact submissions available for testing")
        
        submission_id = submissions[0]["submission_id"]
        original_status = submissions[0]["status"]
        
        # Update status to reviewed
        new_status = "reviewed" if original_status != "reviewed" else "new"
        response = requests.patch(
            f"{BASE_URL}/api/admin/contact/{submission_id}?status={new_status}",
            headers=self.headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "updated"
        
        # Verify the update persisted
        verify_response = requests.get(f"{BASE_URL}/api/admin/contact/{submission_id}", headers=self.headers)
        assert verify_response.status_code == 200
        assert verify_response.json()["status"] == new_status
        
        print(f"SUCCESS: Updated contact status from {original_status} to {new_status}")
        
        # Restore original status
        requests.patch(
            f"{BASE_URL}/api/admin/contact/{submission_id}?status={original_status}",
            headers=self.headers
        )
    
    def test_update_contact_internal_notes(self):
        """Test adding internal notes to contact submission"""
        # First get the list to find an ID
        list_response = requests.get(f"{BASE_URL}/api/admin/contact", headers=self.headers)
        submissions = list_response.json()
        
        if len(submissions) == 0:
            pytest.skip("No contact submissions available for testing")
        
        submission_id = submissions[0]["submission_id"]
        test_note = f"TEST_NOTE_{datetime.now().timestamp()}"
        
        # Update notes
        response = requests.patch(
            f"{BASE_URL}/api/admin/contact/{submission_id}?internal_notes={test_note}",
            headers=self.headers
        )
        
        assert response.status_code == 200
        
        # Verify the update persisted
        verify_response = requests.get(f"{BASE_URL}/api/admin/contact/{submission_id}", headers=self.headers)
        assert verify_response.status_code == 200
        assert verify_response.json()["internal_notes"] == test_note
        
        print(f"SUCCESS: Added internal notes to contact: {test_note}")


class TestRateLimiting:
    """Rate limiting tests for admin authentication"""
    
    def test_rate_limiting_after_failed_attempts(self):
        """Test that rate limiting kicks in after multiple failed attempts"""
        # Note: This test may affect other tests if run in parallel
        # The rate limiting is in-memory and resets on server restart
        
        headers = get_auth_header("rate_limit_test_user", WRONG_PASSWORD)
        
        # Make multiple failed attempts
        for i in range(6):
            response = requests.post(f"{BASE_URL}/api/admin/auth/verify", headers=headers)
            if response.status_code == 429:
                print(f"SUCCESS: Rate limiting triggered after {i+1} attempts")
                return
        
        # If we get here, check if the 6th attempt was rate limited
        assert response.status_code == 429, f"Expected 429 after 5+ failed attempts, got {response.status_code}"
        print("SUCCESS: Rate limiting working correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
