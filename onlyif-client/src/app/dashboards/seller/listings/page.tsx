// ... existing code ...
  // Replace fetch with proper API call
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertiesApi.getProperties();
        
        if (response && response.properties) {
          setProperties(response.properties);
        } else if (Array.isArray(response)) {
          setProperties(response);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
// ... existing code ...