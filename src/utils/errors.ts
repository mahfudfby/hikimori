// src/utils/errors.ts — nilai `catch` bertipe unknown; ambil field umum (Firebase code, message, name) dengan aman.
export type ErrLike = { code?: string; message?: string; name?: string };

/** Objek error yang sama (agar `throw`/`instanceof` tetap berlaku), atau pembungkus untuk nilai non-objek. */
export const asErr = (e: unknown): ErrLike => (e !== null && typeof e === 'object' ? e : { message: String(e) }) as ErrLike;
