import { client } from "@/components/libs/microcms";
import {
  Category,
  CategoryResponse,
  CalnderDate,
  Staff,
  StaffResponse,
} from "@/types/search";
import { useEffect, useState } from "react";

export default function useSearchOptions(year: number, month: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [calendar, setCalendar] = useState<CalnderDate[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    // カテゴリーの取得
    const fetchCategories = async () => {
      try {
        const resCategory: CategoryResponse<Category> =
          await client.getList<Category>({
            endpoint: "category",
            queries: {
              limit: 30,
            },
          });

        if (resCategory.contents.length > 0) {
          setCategories(resCategory.contents);
        }
      } catch {
        console.log("カテゴリーが取得できませんでした");
      }
    };

    /**
     * 日付の一覧
     */
    const generateCalendar = (startYear: number, startMonth: number) => {
      const result: { id: string; value: string }[] = [];
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      let year = startYear;
      let month = startMonth;

      while (
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        const paddedMonth = month.toString().padStart(2, "0");
        result.push({
          id: `${year}-${paddedMonth}`,
          value: `${year}.${paddedMonth}`,
        });

        // 月を進める
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }

      // 日付降順
      result.reverse();

      setCalendar(result);
    };

    // スタッフの取得
    const fetchStaff = async () => {
      try {
        const resStaff: StaffResponse<Staff> = await client.getList<Staff>({
          endpoint: "staff",
          queries: {
            limit: 50,
          },
        });

        if (resStaff.contents.length > 0) {
          setStaff(resStaff.contents);
        }
      } catch {
        console.log("スタッフが取得できませんでした");
      }
    };

    fetchCategories();
    generateCalendar(year, month);
    fetchStaff();
  }, []);

  return {
    categories,
    calendar,
    staff,
  };
}
