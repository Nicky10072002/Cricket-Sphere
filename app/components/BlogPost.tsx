import { Link } from 'react-router';

export type BlogPostData = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  handle: string;
};

type BlogPostProps = {
  post: BlogPostData;
  index?: number;
};

export function BlogPost({ post, index = 0 }: BlogPostProps) {
  const { title, excerpt, author, date, image, handle } = post;

  return (
    <article
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 hover:border-amber-300"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <Link
        to={`/blogs/${handle}`}
        className="relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 no-underline"
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-amber-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Read Article
            </span>
          </div>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-amber-600/70 mb-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{date}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blogs/${handle}`} className="no-underline">
          <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-amber-800/80 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Read More Button */}
        <Link
          to={`/blogs/${handle}`}
          className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors duration-300 no-underline group/link"
        >
          <span>Read More</span>
          <svg
            className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}

