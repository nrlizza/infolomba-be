import { z } from 'zod';

export const loginValidation = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
  role: z.string().min(1, "Role harus diisi"),
});

const indPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

export const masterUserCreateSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama maksimal 100 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(255, "Password maksimal 255 karakter"),
  email: z.string().email("Format email tidak valid").max(100, "Email maksimal 100 karakter"),
  nomor_telephon: z
    .string()
    .regex(indPhoneRegex, "Nomor telepon harus format Indonesia (mis. 0812xxx atau +62812xxx)")
    .optional()
    .nullable(),
  id_pendidikan: z
    .number()
    .int("id_pendidikan harus integer")
    .positive("id_pendidikan harus positif")
    .optional()
    .nullable(),
  nama_instansi: z.string().max(100, "Nama instansi maksimal 100 karakter").optional().nullable(),
  tanggal_lahir: z
    .preprocess((arg) => {
      // terima string ISO atau Date object, atau null/undefined
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional().nullable()),
  poin: z.number().int().min(0, "Poin minimal 0").optional().default(0),
  id_role: z
    .number()
    .int("id_role harus integer")
    .positive("id_role harus positif")
    .optional()
    .nullable(),
});
