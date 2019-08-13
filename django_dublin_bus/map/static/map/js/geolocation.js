// The following geolocation live tracking code was taken and adapted from the tutorial at the following address:
// https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e

// Function to track follow user location
const trackLocation = ({
    onSuccess,
    onError = () => {}
}) => {
    if ('geolocation' in navigator === false) {
        return onError(new Error('Geolocation is not supported by your browser.'));
    }

    // Else use watch position
    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
    });
};