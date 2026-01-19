export type RouteAccessContext = {
  pathname: string
  userId?: string | null
  role?: string | null
}

export const isAuthenticated = (userId?: string | null) => Boolean(userId)

export const hasRole = (role: string | null | undefined, requiredRoles?: string[]) =>
  Boolean(role && requiredRoles?.includes(role))

export const canAccessRoute = ({ pathname, userId, role }: RouteAccessContext) => {
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated(userId)) return { allowed: false, reason: 'unauthenticated' }
    if (!hasRole(role ?? null, ['admin'])) return { allowed: false, reason: 'forbidden' }
    return { allowed: true }
  }

  if (pathname.startsWith('/debug')) {
    if (!isAuthenticated(userId)) return { allowed: false, reason: 'unauthenticated' }
    if (!hasRole(role ?? null, ['admin'])) return { allowed: false, reason: 'forbidden' }
    return { allowed: true }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated(userId)) return { allowed: false, reason: 'unauthenticated' }
    return { allowed: true }
  }

  return { allowed: true }
}
