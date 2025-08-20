import React, { useState, useEffect } from "react";
import "../assets/css/PoliticalPartiesCandidates/ApplicationForm.css";
import axios from 'axios';

const ApplicationForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    partyName: "",
    establishmentDate: "",
    stateRegistration: "",
    headOfficeAddress: "",
    city: "",
    headOfficeState: "",
    pinCode: "",
    phoneNumber: "",
    email: "",
    presidentName: "",
    presidentAadhaar: "",
    presidentAddress: "",
    presidentPhone: "",
    presidentEmail: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: "",
    totalMembers: "",
    maleMembers: "",
    femaleMembers: "",
    declaration: false,
    undertaking: false,
    captchaInput: "",
  });

  // Error state
  const [errors, setErrors] = useState({});
  // Captcha state
  const [captcha, setCaptcha] = useState("");
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  // Loading state
  const [loading, setLoading] = useState(false);

  // API submission function - RENAMED to avoid conflicts
  const submitApplication = async (formDataToSubmit) => {
    try {
      setLoading(true);
      
      // Remove captchaInput before sending to backend
      const { _captchaInput, ...dataToSend } = formDataToSubmit;
      
      console.log("Sending data to backend:", dataToSend);
      
      const response = await axios.post('http://localhost:3000/api/applications', dataToSend);
      
      console.log("Response from backend:", response.data);
      
      if (response.data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      
      if (error.response) {
        console.error('Server error:', error.response.data);
        alert(`Submission failed: ${error.response.data.error || 'Server error'}`);
      } else if (error.request) {
        console.error('Network error:', error.request);
        alert('Network error: Please check if the server is running');
      } else {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captchaText = "";
    for (let i = 0; i < 5; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaText);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, '').slice(-10));
  };

  // Pin code validation
  const validatePinCode = (pinCode) => {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pinCode);
  };

  // Aadhaar validation
  const validateAadhaar = (value) => {
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(value)) {
      return "Aadhaar number must be exactly 12 digits.";
    }
    return "";
  };

  // IFSC validation
  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Clear error on input change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Validate Aadhaar on change
    if (name === "presidentAadhaar") {
      const errorMsg = validateAadhaar(val);
      setErrors((prev) => ({
        ...prev,
        presidentAadhaar: errorMsg,
      }));
    }
  };

  // Validate entire form on submit
  const validateForm = () => {
    const newErrors = {};

    // Required fields check
    if (!formData.partyName.trim()) newErrors.partyName = "Party name is required";
    if (!formData.establishmentDate) newErrors.establishmentDate = "Establishment date is required";
    if (!formData.stateRegistration) newErrors.stateRegistration = "State of registration is required";
    if (!formData.headOfficeAddress.trim()) newErrors.headOfficeAddress = "Head office address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.headOfficeState) newErrors.headOfficeState = "Head office state is required";
    
    // Pin code validation
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "Pin Code is required";
    } else if (!validatePinCode(formData.pinCode)) {
      newErrors.pinCode = "Pin Code must be exactly 6 digits";
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // President details
    if (!formData.presidentName.trim()) newErrors.presidentName = "President name is required";
    const aadhaarError = validateAadhaar(formData.presidentAadhaar);
    if (aadhaarError) newErrors.presidentAadhaar = aadhaarError;
    if (!formData.presidentAddress.trim()) newErrors.presidentAddress = "President address is required";
    
    if (!formData.presidentPhone.trim()) {
      newErrors.presidentPhone = "President phone number is required";
    } else if (!validatePhone(formData.presidentPhone)) {
      newErrors.presidentPhone = "Please enter a valid phone number";
    }

    if (!formData.presidentEmail.trim()) {
      newErrors.presidentEmail = "President email is required";
    } else if (!validateEmail(formData.presidentEmail)) {
      newErrors.presidentEmail = "Please enter a valid email address";
    }

    // Bank details
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!formData.branchName.trim()) newErrors.branchName = "Branch name is required";
    if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
    
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!validateIFSC(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = "Please enter a valid IFSC code";
    }

    // Membership validation
    const totalMembers = parseInt(formData.totalMembers) || 0;
    const maleMembers = parseInt(formData.maleMembers) || 0;
    const femaleMembers = parseInt(formData.femaleMembers) || 0;

    if (!formData.totalMembers || totalMembers < 100) {
      newErrors.totalMembers = "Total members must be at least 100";
    }
    
    if (formData.maleMembers === "") {
      newErrors.maleMembers = "Male members count is required";
    }
    
    if (formData.femaleMembers === "") {
      newErrors.femaleMembers = "Female members count is required";
    }

    // Check if male + female equals total
    if (totalMembers > 0 && maleMembers >= 0 && femaleMembers >= 0) {
      if (maleMembers + femaleMembers !== totalMembers) {
        newErrors.totalMembers = "Total members must equal male + female members";
      }
    }

    // Declarations
    if (!formData.declaration) newErrors.declaration = "Declaration must be accepted";
    if (!formData.undertaking) newErrors.undertaking = "Undertaking must be accepted";

    // Captcha
    if (!formData.captchaInput.trim()) {
      newErrors.captchaInput = "Security code is required";
    } else if (formData.captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
      newErrors.captchaInput = "Security code does not match";
    }

    return newErrors;
  };

  // Submit handler - FIXED
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent double submission
    
    console.log("Form submission started");
    
    const validationErrors = validateForm();
    console.log("Validation errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Form has validation errors, submission stopped");
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      return;
    }

    // Clear any existing errors
    setErrors({});
    
    // Submit to backend
    await submitApplication(formData);
  };

  return (
    <div className="application-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Political Party Registration Form</h1>
          <p>Complete all sections marked with (*) are mandatory</p>
        </div>

        {submitted && (
          <div className="success-alert" role="alert">
            <span className="check-icon" aria-hidden="true">✔</span>
            <div>
              <strong>Application Submitted Successfully!</strong>
              <p>
                Welcome <b>{formData.partyName}</b>! Your party registration details have
                been successfully received. Please wait for verification.
              </p>
            </div>
          </div>
        )}

        <form className="eci-form" onSubmit={handleSubmit} noValidate>
          {/* Party Basic Information */}
          <h2 className="section-title">📑 Party Basic Information</h2>
          <div className="form-grid">
            <label>
              Full Party Name <span className="required">*</span>
              <input
                type="text"
                name="partyName"
                placeholder="Enter complete party name"
                value={formData.partyName}
                onChange={handleChange}
                aria-invalid={!!errors.partyName}
                required
              />
              {errors.partyName && <span className="error">{errors.partyName}</span>}
            </label>
            <label>
              Date of Establishment <span className="required">*</span>
              <input
                type="date"
                name="establishmentDate"
                value={formData.establishmentDate}
                onChange={handleChange}
                aria-invalid={!!errors.establishmentDate}
                required
              />
              {errors.establishmentDate && <span className="error">{errors.establishmentDate}</span>}
            </label>
            <label>
              State of Registration <span className="required">*</span>
              <select
                name="stateRegistration"
                value={formData.stateRegistration}
                onChange={handleChange}
                aria-invalid={!!errors.stateRegistration}
                required
              >
                <option value="">Select State</option>
                <option>Andhra Pradesh</option>
                <option>Arunachal Pradesh</option>
                <option>Assam</option>
                <option>Bihar</option>
                <option>Chhattisgarh</option>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Gujarat</option>
                <option>Haryana</option>
                <option>Himachal Pradesh</option>
                <option>Jharkhand</option>
                <option>Karnataka</option>
                <option>Kerala</option>
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Manipur</option>
                <option>Meghalaya</option>
                <option>Mizoram</option>
                <option>Nagaland</option>
                <option>Odisha</option>
                <option>Punjab</option>
                <option>Rajasthan</option>
                <option>Sikkim</option>
                <option>Tamil Nadu</option>
                <option>Telangana</option>
                <option>Tripura</option>
                <option>Uttar Pradesh</option>
                <option>Uttarakhand</option>
                <option>West Bengal</option>
              </select>
              {errors.stateRegistration && <span className="error">{errors.stateRegistration}</span>}
            </label>
          </div>

          {/* Head Office Address */}
          <h2 className="section-title">🏢 Head Office Address</h2>
          <div className="form-grid">
            <label>
              Complete Address <span className="required">*</span>
              <textarea
                name="headOfficeAddress"
                placeholder="Enter complete head office address"
                value={formData.headOfficeAddress}
                onChange={handleChange}
                aria-invalid={!!errors.headOfficeAddress}
                required
              />
              {errors.headOfficeAddress && <span className="error">{errors.headOfficeAddress}</span>}
            </label>
            <label>
              City <span className="required">*</span>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                aria-invalid={!!errors.city}
                required
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </label>
            <label>
              State <span className="required">*</span>
              <select
                name="headOfficeState"
                value={formData.headOfficeState}
                onChange={handleChange}
                aria-invalid={!!errors.headOfficeState}
                required
              >
                <option value="">Select State</option>
                <option>Andhra Pradesh</option>
                <option>Arunachal Pradesh</option>
                <option>Assam</option>
                <option>Bihar</option>
                <option>Chhattisgarh</option>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Gujarat</option>
                <option>Haryana</option>
                <option>Himachal Pradesh</option>
                <option>Jharkhand</option>
                <option>Karnataka</option>
                <option>Kerala</option>
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Manipur</option>
                <option>Meghalaya</option>
                <option>Mizoram</option>
                <option>Nagaland</option>
                <option>Odisha</option>
                <option>Punjab</option>
                <option>Rajasthan</option>
                <option>Sikkim</option>
                <option>Tamil Nadu</option>
                <option>Telangana</option>
                <option>Tripura</option>
                <option>Uttar Pradesh</option>
                <option>Uttarakhand</option>
                <option>West Bengal</option>
              </select>
              {errors.headOfficeState && <span className="error">{errors.headOfficeState}</span>}
            </label>
            <label>
              Pin Code <span className="required">*</span>
              <input
                type="text"
                name="pinCode"
                placeholder="6-digit Pin Code"
                value={formData.pinCode}
                onChange={handleChange}
                aria-invalid={!!errors.pinCode}
                maxLength={6}
                required
              />
              {errors.pinCode && <span className="error">{errors.pinCode}</span>}
            </label>
            <label>
              Phone Number <span className="required">*</span>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number with STD code"
                value={formData.phoneNumber}
                onChange={handleChange}
                aria-invalid={!!errors.phoneNumber}
                required
              />
              {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
            </label>
            <label>
              Email Address <span className="required">*</span>
              <input
                type="email"
                name="email"
                placeholder="Enter official email address"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
          </div>

          {/* Office Bearers - President */}
          <h2 className="section-title">👥 President Details</h2>
          <div className="form-grid">
            <label>
              Full Name <span className="required">*</span>
              <input
                type="text"
                name="presidentName"
                placeholder="Enter president's full name"
                value={formData.presidentName}
                onChange={handleChange}
                aria-invalid={!!errors.presidentName}
                required
              />
              {errors.presidentName && <span className="error">{errors.presidentName}</span>}
            </label>
            <label>
              Aadhaar Number <span className="required">*</span>
              <input
                type="text"
                name="presidentAadhaar"
                placeholder="12-digit Aadhaar number"
                value={formData.presidentAadhaar}
                onChange={handleChange}
                aria-invalid={!!errors.presidentAadhaar}
                maxLength={12}
                required
              />
              {errors.presidentAadhaar && <span className="error">{errors.presidentAadhaar}</span>}
            </label>
            <label>
              Address <span className="required">*</span>
              <textarea
                name="presidentAddress"
                placeholder="Enter complete address"
                value={formData.presidentAddress}
                onChange={handleChange}
                aria-invalid={!!errors.presidentAddress}
                required
              />
              {errors.presidentAddress && <span className="error">{errors.presidentAddress}</span>}
            </label>
            <label>
              Phone Number <span className="required">*</span>
              <input
                type="text"
                name="presidentPhone"
                placeholder="Enter phone number"
                value={formData.presidentPhone}
                onChange={handleChange}
                aria-invalid={!!errors.presidentPhone}
                required
              />
              {errors.presidentPhone && <span className="error">{errors.presidentPhone}</span>}
            </label>
            <label>
              Email Address <span className="required">*</span>
              <input
                type="email"
                name="presidentEmail"
                placeholder="Enter email address"
                value={formData.presidentEmail}
                onChange={handleChange}
                aria-invalid={!!errors.presidentEmail}
                required
              />
              {errors.presidentEmail && <span className="error">{errors.presidentEmail}</span>}
            </label>
          </div>

          {/* Bank Account Details */}
          <h2 className="section-title">🏦 Bank Account Details</h2>
          <div className="form-grid">
            <label>
              Bank Name <span className="required">*</span>
              <input
                type="text"
                name="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={handleChange}
                aria-invalid={!!errors.bankName}
                required
              />
              {errors.bankName && <span className="error">{errors.bankName}</span>}
            </label>
            <label>
              Branch Name <span className="required">*</span>
              <input
                type="text"
                name="branchName"
                placeholder="Enter branch name"
                value={formData.branchName}
                onChange={handleChange}
                aria-invalid={!!errors.branchName}
                required
              />
              {errors.branchName && <span className="error">{errors.branchName}</span>}
            </label>
            <label>
              Account Number <span className="required">*</span>
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
                aria-invalid={!!errors.accountNumber}
                required
              />
              {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
            </label>
            <label>
              IFSC Code <span className="required">*</span>
              <input
                type="text"
                name="ifscCode"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={handleChange}
                aria-invalid={!!errors.ifscCode}
                maxLength={11}
                required
              />
              {errors.ifscCode && <span className="error">{errors.ifscCode}</span>}
            </label>
          </div>

          {/* Membership Details */}
          <h2 className="section-title">🧑‍🤝‍🧑 Membership Details</h2>
          <div className="form-grid">
            <label>
              Total Members <span className="required">*</span>
              <input
                type="number"
                name="totalMembers"
                placeholder="Minimum 100"
                min="100"
                value={formData.totalMembers}
                onChange={handleChange}
                aria-invalid={!!errors.totalMembers}
                required
              />
              {errors.totalMembers && <span className="error">{errors.totalMembers}</span>}
            </label>
            <label>
              Male Members <span className="required">*</span>
              <input
                type="number"
                name="maleMembers"
                min="0"
                value={formData.maleMembers}
                onChange={handleChange}
                aria-invalid={!!errors.maleMembers}
                required
              />
              {errors.maleMembers && <span className="error">{errors.maleMembers}</span>}
            </label>
            <label>
              Female Members <span className="required">*</span>
              <input
                type="number"
                name="femaleMembers"
                min="0"
                value={formData.femaleMembers}
                onChange={handleChange}
                aria-invalid={!!errors.femaleMembers}
                required
              />
              {errors.femaleMembers && <span className="error">{errors.femaleMembers}</span>}
            </label>
          </div>

          {/* Declarations */}
          <section>
            <h2 className="section-title">📜 Declarations and Undertakings</h2>
            <div className="declaration-card declaration-bg1">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
                aria-invalid={!!errors.declaration}
                required
              />
              <span>
                <strong>Declaration *</strong>
                <br />
                I hereby declare that all the information provided in this application is true and correct to the best of my knowledge.
              </span>
            </div>
            {errors.declaration && <span className="error">{errors.declaration}</span>}
            <div className="declaration-card declaration-bg2">
              <input
                type="checkbox"
                name="undertaking"
                checked={formData.undertaking}
                onChange={handleChange}
                aria-invalid={!!errors.undertaking}
                required
              />
              <span>
                <strong>Undertaking *</strong>
                <br />
                I undertake to comply with all the provisions of the Representation of the People Act, 1951.
              </span>
            </div>
            {errors.undertaking && <span className="error">{errors.undertaking}</span>}
          </section>

          {/* Captcha */}
          <div className="captcha-container">
            <div className="captcha-label">
              Security Code <span className="required">*</span>
            </div>
            <div className="captcha-display-refresh">
              <div className="captcha-display" aria-label="Captcha code" aria-live="polite">{captcha}</div>
              <button
                type="button"
                className="captcha-refresh"
                onClick={generateCaptcha}
                title="Refresh Captcha"
                aria-label="Refresh Captcha"
              >
                &#x21bb;
              </button>
            </div>
            <input
              type="text"
              className="captcha-input"
              name="captchaInput"
              value={formData.captchaInput}
              onChange={handleChange}
              placeholder="Enter code"
              maxLength={5}
              aria-invalid={!!errors.captchaInput}
              required
            />
            {errors.captchaInput && <span className="error">{errors.captchaInput}</span>}
          </div>

          {/* Buttons - ONLY THING CHANGED */}
          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              className="btn-clear"
              onClick={() => {
                setFormData({
                  partyName: "",
                  establishmentDate: "",
                  stateRegistration: "",
                  headOfficeAddress: "",
                  city: "",
                  headOfficeState: "",
                  pinCode: "",
                  phoneNumber: "",
                  email: "",
                  presidentName: "",
                  presidentAadhaar: "",
                  presidentAddress: "",
                  presidentPhone: "",
                  presidentEmail: "",
                  bankName: "",
                  branchName: "",
                  accountNumber: "",
                  ifscCode: "",
                  totalMembers: "",
                  maleMembers: "",
                  femaleMembers: "",
                  declaration: false,
                  undertaking: false,
                  captchaInput: "",
                });
                setErrors({});
                generateCaptcha();
                setSubmitted(false);
              }}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
