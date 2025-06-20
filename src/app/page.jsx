import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-8 text-black">
        Welcome to My Album
      </h1>
      <div className="flex space-x-4">
        <Link href="/albums">
          <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition cursor-pointer">
            Go to Albums
          </button>
        </Link>
        <Link href="/blogs">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
            Go to Blogs
          </button>
        </Link>
      </div>
    </div>
  );
}
