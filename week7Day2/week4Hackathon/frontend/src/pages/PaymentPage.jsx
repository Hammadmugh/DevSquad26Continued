import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { API_CONFIG } from '../config/apiConfig';

const PaymentPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usePreviousCard, setUsePreviousCard] = useState(false);
  const [hasPreviousCard, setHasPreviousCard] = useState(false);

  const plans = {
    basic: { name: 'Basic', price: '4.99' },
    standard: { name: 'Standard', price: '8.99' },
    premium: { name: 'Premium', price: '12.99' }
  };

  const selectedPlan = plans[planId] || plans.basic;

  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Check for previously stored card details
  useEffect(() => {
    const storedCardDetails = localStorage.getItem('cardDetails');
    if (storedCardDetails) {
      setHasPreviousCard(true);
      setUsePreviousCard(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        const month = formatted.slice(0, 2);
        const year = formatted.slice(2, 4);
        setFormData(prev => ({ ...prev, [name]: `${month}/${year}` }));
      } else {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    }
    // Format CVV
    else if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 3) }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (!formData.cardNumber.replace(/\s/g, '') || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    // Validate expiry date is not in the past
    const [month, year] = formData.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Convert YY to YYYY (assuming 2000s for now)
    const fullYear = parseInt(`20${year}`);
    const expiryMonth = parseInt(month);
    
    // Check if expiry date is in the past
    if (fullYear < currentYear || (fullYear === currentYear && expiryMonth < currentMonth)) {
      setError('Expiry date cannot be in the past');
      return false;
    }

    if (!formData.cvv || formData.cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Skip validation if using previous card
    if (!usePreviousCard && !validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to continue');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Get card details - either from form or stored
      let cardDetails;
      if (usePreviousCard) {
        const stored = localStorage.getItem('cardDetails');
        cardDetails = stored ? JSON.parse(stored) : null;
        if (!cardDetails) {
          setError('Stored card details not found. Please enter card details.');
          setLoading(false);
          return;
        }
      } else {
        cardDetails = {
          cardholderName: formData.cardholderName,
          cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4), // Only store last 4 digits
          expiryDate: formData.expiryDate
        };
      }

      const response = await fetch(`${API_CONFIG.AUTH_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          planName: selectedPlan.name,
          cardDetails: cardDetails
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      setSuccess('Subscription activated successfully! Redirecting...');
      
      // Store subscription in localStorage
      localStorage.setItem('userSubscription', JSON.stringify({
        planId,
        planName: selectedPlan.name,
        startDate: new Date().toISOString(),
        status: 'active'
      }));

      // Store card details for future use (only if new card was used)
      if (!usePreviousCard) {
        localStorage.setItem('cardDetails', JSON.stringify({
          cardholderName: formData.cardholderName,
          cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4),
          expiryDate: formData.expiryDate
        }));
      }

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="px-4 sm:px-6 lg:px-0 lg:max-w-[600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition mb-8"
        >
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-400">
            Subscribe to {selectedPlan.name} plan for ${selectedPlan.price}/month
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Section */}
          <div className="bg-[#141414] border border-[#262626] rounded-lg p-8 space-y-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Lock size={20} className="text-[#E60000]" />
              Payment Details
            </h2>

            {/* Use Previous Card Option */}
            {hasPreviousCard && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePreviousCard}
                    onChange={(e) => setUsePreviousCard(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-400 cursor-pointer"
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">Use saved card</p>
                    <p className="text-gray-400 text-xs">
                      Card ending in ••••
                      {(() => {
                        const saved = localStorage.getItem('cardDetails');
                        return saved ? JSON.parse(saved).cardNumber : '';
                      })()}
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Card Preview & Form Fields */}
            {!usePreviousCard && (
              <>
            {/* Card Preview */}
            <div className="bg-gradient-to-br from-[#E60000] to-red-900 rounded-lg p-6 text-white h-40 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide">Card Number</p>
                <p className="text-xl font-mono tracking-wider mt-2">
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/70 uppercase">Cardholder Name</p>
                  <p className="text-sm font-semibold mt-1">
                    {formData.cardholderName || 'Your Name'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase">Expires</p>
                  <p className="text-sm font-semibold mt-1">
                    {formData.expiryDate || 'MM/YY'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E60000] transition"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E60000] transition font-mono"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E60000] transition"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E60000] transition"
                />
              </div>
            </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">{selectedPlan.name} Plan</span>
              <span className="text-white font-semibold">${selectedPlan.price}/month</span>
            </div>
            <div className="border-t border-[#262626] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold">Total</span>
                <span className="text-white font-bold text-xl">${selectedPlan.price}</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                7-day free trial. Billing starts after trial period. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#E60000] hover:bg-red-700'
            }`}
          >
            {loading ? 'Processing...' : `${usePreviousCard ? 'Complete with Saved Card' : `Subscribe for $${selectedPlan.price}/month`}`}
          </button>

          {/* Security Info */}
          <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
            <Lock size={14} />
            Your payment information is secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
