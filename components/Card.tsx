export default function Card({ title, children }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}