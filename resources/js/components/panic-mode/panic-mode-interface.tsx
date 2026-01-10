import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Heart, 
  MapPin, 
  Clock, 
  X,
  Shield,
  Headphones,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Navigation
} from 'lucide-react';
import { usePanicMode } from '@/hooks/use-panic-mode';
import { PanicResource } from '@/services/panic-mode-service';

interface PanicModeInterfaceProps {
  userId: string;
  authToken: string;
  onClose?: () => void;
  triggerSource?: 'manual' | 'crisis_detection' | 'escalation';
}

export function PanicModeInterface({ 
  userId, 
  authToken, 
  onClose, 
  triggerSource = 'manual' 
}: PanicModeInterfaceProps) {
  const {
    isActive,
    currentSession,
    panicResources,
    nearbyServices,
    breathingExercises,
    currentExercise,
    breathingPhase,
    userLocation,
    isLoading,
    error,
    startPanicMode,
    endPanicMode,
    accessResource,
    rateResource,
    contactEmergencyServices,
    startBreathingExercise,
    stopBreathingExercise,
    getEmergencyResources,
    getImmediateHelpResources,
    formatSessionDuration,
  } = usePanicMode({
    authToken,
    userId,
    autoStartLocation: true,
    enableNotifications: true,
  });

  const [activeTab, setActiveTab] = useState<'immediate' | 'breathing' | 'nearby' | 'emergency'>('immediate');
  const [showRating, setShowRating] = useState<string | null>(null);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  // Auto-start panic mode when component mounts
  useEffect(() => {
    if (!isActive) {
      startPanicMode(triggerSource);
    }
  }, []);

  const handleResourceAccess = async (resource: PanicResource) => {
    try {
      await accessResource(resource.id);
      
      // Open resource based on type
      if (resource.contactInfo.phone) {
        window.open(`tel:${resource.contactInfo.phone}`, '_self');
      } else if (resource.contactInfo.url) {
        window.open(resource.contactInfo.url, '_blank', 'noopener,noreferrer');
      }
      
      // Show rating after a delay
      setTimeout(() => {
        setShowRating(resource.id);
      }, 2000);
    } catch (err) {
      console.error('Failed to access resource:', err);
    }
  };

  const handleResourceRating = async (resourceId: string, helpful: boolean) => {
    try {
      await rateResource(resourceId, helpful, ratingFeedback);
      setShowRating(null);
      setRatingFeedback('');
    } catch (err) {
      console.error('Failed to rate resource:', err);
    }
  };

  const handleEndSession = async () => {
    try {
      await endPanicMode(sessionNotes);
      onClose?.();
    } catch (err) {
      console.error('Failed to end panic mode:', err);
    }
  };

  const handleEmergencyCall = async () => {
    try {
      await contactEmergencyServices();
      window.open('tel:911', '_self');
    } catch (err) {
      console.error('Failed to contact emergency services:', err);
    }
  };

  const getResourceIcon = (type: PanicResource['type']) => {
    switch (type) {
      case 'hotline':
        return <Phone className="w-5 h-5" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'breathing_exercise':
        return <Heart className="w-5 h-5" />;
      case 'emergency_service':
        return <Shield className="w-5 h-5" />;
      case 'self_help':
        return <Headphones className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getBreathingPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500';
      case 'hold':
        return 'bg-purple-500';
      case 'exhale':
        return 'bg-green-500';
      case 'pause':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  if (!isActive && !isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        >
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crisis Support</h2>
            <p className="text-gray-600 mb-6">
              You're not alone. Immediate help and resources are available.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => startPanicMode(triggerSource)}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Get Help Now'}
              </button>
              <button
                onClick={onClose}
                className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-900">Crisis Support Active</h1>
                <p className="text-red-700">
                  {currentSession && (
                    <>Session: {formatSessionDuration(currentSession)}</>
                  )}
                  {userLocation && (
                    <span className="ml-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location tracked
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEmergencyCall}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Phone className="w-4 h-4" />
                <span>Call 911</span>
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className="p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'immediate', label: 'Immediate Help', icon: AlertTriangle },
              { id: 'breathing', label: 'Breathing', icon: Heart },
              { id: 'nearby', label: 'Nearby Services', icon: MapPin },
              { id: 'emergency', label: 'End Session', icon: Clock },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Immediate Help Tab */}
          {activeTab === 'immediate' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">You Are Not Alone</h2>
                <p className="text-gray-600">
                  Immediate help is available. Choose the option that feels right for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getImmediateHelpResources().map((resource) => (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 cursor-pointer transition-colors"
                    onClick={() => handleResourceAccess(resource)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{resource.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {resource.availability.alwaysAvailable ? (
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>24/7 Available</span>
                              </span>
                            ) : (
                              resource.availability.hours && (
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{resource.availability.hours.start} - {resource.availability.hours.end}</span>
                                </span>
                              )
                            )}
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Breathing Exercises Tab */}
          {activeTab === 'breathing' && (
            <div className="space-y-6">
              {currentExercise ? (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentExercise.name}</h2>
                  
                  {breathingPhase && (
                    <div className="mb-6">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className={`w-full h-full rounded-full ${getBreathingPhaseColor(breathingPhase.phase)} transition-all duration-1000 flex items-center justify-center`}>
                          <span className="text-white font-medium capitalize">
                            {breathingPhase.phase}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-lg font-medium text-gray-900 mb-2">
                        {breathingPhase.phase.charAt(0).toUpperCase() + breathingPhase.phase.slice(1)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        Cycle {breathingPhase.cycleCount} of {breathingPhase.totalCycles}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${breathingPhase.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={stopBreathingExercise}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Stop Exercise
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Breathing Exercises</h2>
                    <p className="text-gray-600">
                      Guided breathing can help calm your mind and body.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {breathingExercises.map((exercise) => (
                      <motion.div
                        key={exercise.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => startBreathingExercise(exercise.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                            <Heart className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{exercise.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{Math.floor(exercise.duration / 60)} minutes</span>
                              <span className="capitalize">{exercise.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nearby Services Tab */}
          {activeTab === 'nearby' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Nearby Services</h2>
                <p className="text-gray-600">
                  Professional help and emergency services in your area.
                </p>
              </div>

              {nearbyServices.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {userLocation ? 'Loading nearby services...' : 'Location access needed to show nearby services'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearbyServices.map((service) => (
                    <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            {service.distance && (
                              <span className="flex items-center space-x-1">
                                <Navigation className="w-3 h-3" />
                                <span>{service.distance.toFixed(1)} km away</span>
                              </span>
                            )}
                            <span>{service.availability.hours}</span>
                            {service.availability.emergency24h && (
                              <span className="text-red-600 font-medium">24/7 Emergency</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {service.services.slice(0, 3).map((serviceType, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {serviceType}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => window.open(`tel:${service.contactInfo.phone}`, '_self')}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Call
                          </button>
                          {service.contactInfo.website && (
                            <button
                              onClick={() => window.open(service.contactInfo.website, '_blank')}
                              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Website
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* End Session Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">End Crisis Support Session</h2>
                <p className="text-gray-600">
                  How are you feeling now? Your feedback helps us improve support.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Notes (Optional)
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="How did this session help? Any feedback for improvement?"
                  />
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setActiveTab('immediate')}
                    className="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Continue Session
                  </button>
                  <button
                    onClick={handleEndSession}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resource Rating Modal */}
        <AnimatePresence>
          {showRating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowRating(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  How helpful was this resource?
                </h3>
                
                <textarea
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
                  placeholder="Optional feedback..."
                />
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleResourceRating(showRating, false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Not Helpful</span>
                  </button>
                  <button
                    onClick={() => handleResourceRating(showRating, true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}