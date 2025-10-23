import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Middleware del servidor para manejar autenticación y protección de rutas
export const handle: Handle = async ({ event, resolve }) => {
	// Obtener la ruta actual
	const { pathname } = event.url;

	// Rutas que están permitidas para usuarios no autenticados (invitados)
	const guestAllowedRoutes = ['/', '/ranking'];

	// Rutas que requieren autenticación
	const protectedRoutes = ['/profile', '/create-room', '/join-room'];

	// Rutas de salas dinámicas (requieren autenticación)
	const isRoomRoute = pathname.startsWith('/room/');

	// Verificar si la ruta actual requiere autenticación
	const requiresAuth = protectedRoutes.some((route) => pathname === route) || isRoomRoute;

	// Si la ruta requiere autenticación, verificar el token
	if (requiresAuth) {
		// Obtener el token de las cookies
		const token = event.cookies.get('auth_token');

		// Si no hay token, redirigir al login
		if (!token) {
			// Guardar la URL de destino para redirigir después del login
			const redirectTo = encodeURIComponent(pathname);
			throw redirect(302, `/?redirect=${redirectTo}`);
		}
	}

	// Si el usuario está autenticado y trata de acceder a rutas de invitado,
	// redirigir a la página principal (opcional)
	if (pathname === '/' && event.cookies.get('auth_token')) {
		// Opcional: redirigir usuarios autenticados a una página diferente
		// throw redirect(302, '/');
	}

	// Continuar con el procesamiento normal de la solicitud
	const response = await resolve(event);

	// Agregar headers de seguridad básicos
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};
