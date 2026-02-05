import requests
import sys
from datetime import datetime
import json

class BelVectorStroyAPITester:
    def __init__(self, base_url="https://deck-builder-50.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"Response: {json.dumps(result['response_data'], indent=2, ensure_ascii=False)}")
                except:
                    result["response_data"] = response.text
                    print(f"Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result["error"] = error_data
                    print(f"Error response: {json.dumps(error_data, indent=2, ensure_ascii=False)}")
                except:
                    result["error"] = response.text
                    print(f"Error response: {response.text}")

            self.results.append(result)
            return success, result["response_data"] if success else result["error"]

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.results.append(result)
            return False, str(e)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test GET status
        success1, _ = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
        # Test POST status
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        success2, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data=test_data
        )
        
        return success1 and success2

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": f"Тест Пользователь {datetime.now().strftime('%H:%M:%S')}",
            "phone": "+7 925 759 09 03"
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
        
        if success and response:
            # Verify response structure
            required_fields = ['id', 'name', 'phone', 'timestamp', 'email_sent']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"⚠️  Warning: Missing fields in response: {missing_fields}")
                return False
            
            # Verify data matches
            if response['name'] != test_data['name'] or response['phone'] != test_data['phone']:
                print(f"⚠️  Warning: Response data doesn't match input data")
                return False
                
            print(f"✅ Contact form response structure is correct")
            return True
        
        return success

    def test_get_contacts(self):
        """Test getting all contact requests"""
        success, response = self.run_test(
            "Get All Contact Requests",
            "GET",
            "api/contacts",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Retrieved {len(response)} contact requests")
            return True
        
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting БелВекторСтрой API Tests...")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed, stopping tests")
            return False
        
        # Test status endpoints
        if not self.test_status_endpoints():
            print("⚠️  Status endpoints failed")
        
        # Test contact form (main functionality)
        if not self.test_contact_form_submission():
            print("❌ Contact form submission failed - CRITICAL")
        
        # Test contact retrieval
        if not self.test_get_contacts():
            print("⚠️  Contact retrieval failed")
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = BelVectorStroyAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w', encoding='utf-8') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
            "results": tester.results
        }, f, indent=2, ensure_ascii=False)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())