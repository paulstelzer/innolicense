import { ReflectMetadata } from '@nestjs/common';

/**
 * Nestjs Decorator for roles at the controller
 * @param roles Roles
 */
export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);
