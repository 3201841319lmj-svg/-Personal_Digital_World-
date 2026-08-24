export const SECTIONS = [
  { id: "must", title: "今天要完成", hint: "先从最重要的一件开始", marker: "01" },
  { id: "progress", title: "今天想推进", hint: "慢慢做，也是在向前", marker: "02" },
  { id: "later", title: "有空再处理", hint: "暂时放在这里，不必惦记", marker: "03" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export type Task = {
  id: string;
  date: string;
  section: SectionId;
  title: string;
  completed: boolean;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
};
