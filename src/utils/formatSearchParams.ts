export default function formatSearchParams(
  category: string[],
  date: string[],
  staff: string[]
): string {
  const categoryFilters = category
    .map((c) => `post_category[equals]${c}`)
    .join("[or]");

  const dateFilters = date
    .map((d) => {
      const from = `${d}-01T00:00:00Z`;
      const to = `${d}-31T23:59:59Z`;
      return `date[greater_than]${from}[and]date[less_than]${to}`;
    })
    .join("[or]");

  // post_staff（単一）と post_staff_multiple（複数）の両方に対応
  const staffFilters = staff.map((s) =>
        `(post_staff[equals]${s}[or]post_staff_multiple[contains]${s})`
    )
    .join("[or]");

  const filters = [categoryFilters, dateFilters, staffFilters]
    .filter(Boolean)
    .join("[and]");

  return filters;
}
