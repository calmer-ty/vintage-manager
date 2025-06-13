import ItemTable from "./table";
// import WriteChart from "./chart";

export default function ItemWrite({ userId }: { userId: string }) {
  return (
    <article className="w-full h-full flex justify-center items-center gap-4 bg-gray-100">
      <ItemTable userId={userId} />
      {/* <WriteChart /> */}
    </article>
  );
}
