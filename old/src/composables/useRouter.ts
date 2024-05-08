import { Route } from '../types';

const parseRoute = (route: string): Route => {
	if (route.startsWith('/download')) {
		const parts = route.split('/');
		return {
			route: '/download',
			param: { downloadId: parts[2] },
		};
	} else {
		return { route: '/' };
	}
};

const curretRoute = ref<Route>(parseRoute(window.location.pathname));

window.onpopstate = ({ state }) => {
	curretRoute.value = parseRoute(state?.route || '');
};

export const useRouter = () => {
	const navTo = (route: string) => {
		curretRoute.value = parseRoute(route);
		history.pushState({ route }, route, route);
	};

	return {
		curretRoute,
		navTo,
	};
};
