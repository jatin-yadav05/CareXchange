'use client';

import GradientTracing from '@/components/TracingHighlight';

const flowSteps = [
  {
    id: 'register',
    title: 'Register/Login',
    icon: '👤',
    mainPoints: [
      'Quick email signup',
      'Secure authentication',
      'Profile creation'
    ],
    notes: 'Enter basic details like name, email, phone number. Choose between donor or recipient role.',
    color: '#3caa99'
  },
  {
    id: 'verify',
    title: 'Identity Verification',
    icon: '✓',
    mainPoints: [
      'Document upload',
      'AI verification',
      'Manual review'
    ],
    notes: 'Upload government ID & medical license (if healthcare provider). AI checks document authenticity.',
    color: '#40cab7'
  },
  {
    id: 'donate',
    title: 'Medicine Donation',
    icon: '💊',
    mainPoints: [
      'Medicine details',
      'Expiry check',
      'Photos upload'
    ],
    notes: 'Add medicine name, expiry, condition. Upload clear photos. Set pickup location & availability.',
    color: '#3caa99'
  },
  {
    id: 'request',
    title: 'Request Medicines',
    icon: '🔍',
    mainPoints: [
      'Smart search',
      'Filter options',
      'Location check'
    ],
    notes: 'Search by name or category. Filter by distance, expiry date. Check medicine details & donor ratings.',
    color: '#40cab7'
  },
  {
    id: 'exchange',
    title: 'Secure Exchange',
    icon: '🤝',
    mainPoints: [
      'Verification code',
      'Safety guidelines',
      'Handover process'
    ],
    notes: 'Meet at safe location. Verify medicine condition. Complete handover using unique verification code.',
    color: '#3caa99'
  },
  {
    id: 'feedback',
    title: 'Trust Building',
    icon: '⭐',
    mainPoints: [
      'Rate experience',
      'Add feedback',
      'Build reputation'
    ],
    notes: 'Rate the exchange experience. Add detailed feedback. Help build community trust scores.',
    color: '#40cab7'
  }
];
const UserFlowDiagram = () => {
  return (
    <div className="relative py-8 w-full max-w-[1200px] mx-auto flex">
      <GradientTracing
    width={300}
    height={100}
    path="M0,50 C25,0 50,100 75,50 S125,0 150,50 S200,100 225,50 S275,0 300,50 M0,50 C25,100 50,0 75,50 S125,100 150,50 S200,0 225,50 S275,100 300,50"
    gradientColors={["#FF6B6B", "#FF6B6B", "#4ECDC4"]}
  />
  <GradientTracing
    width={300}
    height={100}
    path="M0,50 C25,0 50,100 75,50 S125,0 150,50 S200,100 225,50 S275,0 300,50 M0,50 C25,100 50,0 75,50 S125,100 150,50 S200,0 225,50 S275,100 300,50"
    gradientColors={["#FF6B6B", "#FF6B6B", "#4ECDC4"]}
  />
  <GradientTracing
    width={300}
    height={100}
    path="M0,50 C25,0 50,100 75,50 S125,0 150,50 S200,100 225,50 S275,0 300,50 M0,50 C25,100 50,0 75,50 S125,100 150,50 S200,0 225,50 S275,100 300,50"
    gradientColors={["#FF6B6B", "#FF6B6B", "#4ECDC4"]}
  />
  <GradientTracing
    width={300}
    height={100}
    path="M0,50 C25,0 50,100 75,50 S125,0 150,50 S200,100 225,50 S275,0 300,50 M0,50 C25,100 50,0 75,50 S125,100 150,50 S200,0 225,50 S275,100 300,50"
    gradientColors={["#FF6B6B", "#FF6B6B", "#4ECDC4"]}
  />
  
    </div>
  );
};

export default UserFlowDiagram; 