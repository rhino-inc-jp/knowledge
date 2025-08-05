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

  const staffFilters = staff.map((s) => `post_staff[equals]${s}`).join("[or]");
  const filters = [categoryFilters, dateFilters, staffFilters]
    .filter(Boolean)
    .join("[and]");
  return filters;
}
