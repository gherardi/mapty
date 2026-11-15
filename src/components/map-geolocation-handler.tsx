import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { toast } from 'sonner';
import useMapStore from '@/stores/map-store';
import useLocationStore, {
	UserGeoLocationStatus,
} from '@/stores/geo-location-store';

export function MapGeolocationHandler() {
	const map = useMap();
	const setMap = useMapStore((state) => state.setMap);

	useEffect(() => {
		setMap(map);

		const getLocation = () => {
			if (navigator.geolocation)
				navigator.geolocation.getCurrentPosition(
					function ({ coords }) {
						const { latitude, longitude } = coords;
						map.flyTo([latitude, longitude], map.getZoom());
						useLocationStore.setState({
							userCoords: [latitude, longitude],
							userLocationStatus: UserGeoLocationStatus.SUCCESS,
						});
					},
					function () {
						toast.error('Unable to get your location', {
							description: 'Please allow location access to continue',
						});
						useLocationStore.setState({
							userLocationStatus: UserGeoLocationStatus.ERROR,
						});
					}
				);
		};
		getLocation();
	}, [map, setMap]);

	return null;
}
