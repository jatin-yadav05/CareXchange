const getCurrentLocation = (setPosition, reverseGeocode, toast) => {
  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by your browser. Please enter location manually.');
    return;
  }

  toast.loading('Getting your location...');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
      reverseGeocode(latitude, longitude);
      toast.dismiss();
      toast.success('Location found successfully!');
    },
    (error) => {
      toast.dismiss();
      switch(error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Location permission denied. Please enable location access.');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location information unavailable. Please try again.');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out. Please try again.');
          break;
        default:
          toast.error('Unable to get location. Please enter manually.');
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

export default getCurrentLocation;