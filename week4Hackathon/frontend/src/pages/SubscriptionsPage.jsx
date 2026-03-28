import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, X } from 'lucide-react';
import { authService } from '../services/authService';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '4.99',
      billingCycle: 'Monthly',
      features: [
        'HD (720p) streaming',
        'Watch on 1 device at a time',
        'Standard sound quality',
        'Cancel anytime'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '8.99',
      billingCycle: 'Monthly',
      features: [
        'Full HD (1080p) streaming',
        'Watch on 2 devices at a time',
        'Dolby Digital Plus sound',
        'Cancel anytime'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '12.99',
      billingCycle: 'Monthly',
      features: [
        '4K Ultra HD (2160p) streaming',
        'Watch on 4 devices at a time',
        'Dolby Atmos sound',
        'Download for offline viewing',
        'Cancel anytime'
      ],
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const handleSelectPlan = (planId) => {
    // Check if user is authenticated first
    if (!authService.isAuthenticated()) {
      // Redirect to login first
      navigate('/login');
      return;
    }

    // Check if user already has active subscription
    const subscription = localStorage.getItem('userSubscription');
    
    if (subscription) {
      const subData = JSON.parse(subscription);
      if (subData.status === 'active') {
        setCurrentSubscription(subData);
        setShowModal(true);
        return;
      }
    }

    setSelectedPlan(planId);
    // Navigate to payment page with selected plan
    navigate(`/payment/${planId}`);
  };

  // Get current subscription to check if user has one
  React.useEffect(() => {
    const subscription = localStorage.getItem('userSubscription');
    if (subscription) {
      const subData = JSON.parse(subscription);
      setCurrentSubscription(subData);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition mb-8"
        >
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the perfect plan for you and start watching your favorite movies and shows.
            All plans include a 7-day free trial.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#141414] rounded-lg overflow-hidden border transition transform hover:scale-105 ${
                plan.popular
                  ? 'border-[#E60000] shadow-lg shadow-red-500/50 md:scale-105'
                  : 'border-[#262626]'
              } ${
                currentSubscription?.planId === plan.id && currentSubscription?.status === 'active'
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#E60000] text-white py-2 text-center text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              {/* Current Plan Badge */}
              {currentSubscription?.planId === plan.id && currentSubscription?.status === 'active' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white py-2 px-4 text-center text-sm font-bold rounded-bl-lg">
                  CURRENT PLAN
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-20' : ''}`}>
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.billingCycle}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                  <p className="text-gray-400 text-xs mt-2">Cancel anytime. 7-day free trial.</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition ${
                    plan.popular
                      ? 'bg-[#E60000] hover:bg-red-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  Select Plan
                </button>

                {/* Features */}
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm font-semibold uppercase">What's Included</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-[#E60000] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto mt-16">
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h3 className="text-white text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Can I change my plan?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400 text-sm">
                We accept all major credit and debit cards (Visa, Mastercard, American Express).
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-400 text-sm">
                Yes! All new subscribers get a 7-day free trial. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>

        {/* Already Subscribed Modal */}
        {showModal && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 z-40 transition"
              onClick={() => setShowModal(false)}
            ></div>

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] border border-[#262626] rounded-lg shadow-2xl z-50 w-full max-w-sm mx-4">
            {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <div className="p-8 text-center">
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#E60000]/20 border border-[#E60000] flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-[#E60000]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  You're Already Subscribed!
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                  You currently have an active subscription to the{' '}
                  <span className="text-[#E60000] font-semibold">{currentSubscription?.planName} Plan</span>.
                </p>

                <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6 text-left border border-[#262626]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Current Plan</span>
                    <span className="text-white font-semibold">{currentSubscription?.planName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-green-400 text-sm font-semibold uppercase">
                      {currentSubscription?.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Since</span>
                    <span className="text-gray-300 text-sm">
                      {currentSubscription?.startDate
                        ? new Date(currentSubscription.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs mb-6">
                  To upgrade or downgrade your plan, please contact our support team.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate('/');
                    }}
                    className="w-full bg-[#E60000] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Continue Watching
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg border border-white/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
