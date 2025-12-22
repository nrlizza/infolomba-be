export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(result.error);
    }

    const validatedData = result.data;

    // Ambil fixed keys dari schema
    const fixedKeys = Object.keys(schema.shape);

    // Filter key dinamis
    const dynamicEntries = Object.entries(validatedData).filter(
      ([key]) => !fixedKeys.includes(key)
    );

    // Salin validatedData ke objek baru
    const newValidated = { ...validatedData };

    if (dynamicEntries.length > 0) {
      const [lastKey, lastValue] = dynamicEntries[dynamicEntries.length - 1];
      newValidated.nama_kolom = lastKey;
      newValidated.keyword = lastValue;
    }

    req.validated = newValidated;

    next();
  };
}
