'use client';

import { Fragment, useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  });

  const jumpToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 애니메이션 효과
    });
  };

  return (
    <Fragment>
      {show ? (
        <div className="fixed bottom-0 right-0 mb-6 mr-6 z-10">
          <button
            onClick={jumpToTop}
            className="bg-black text-white rounded-full p-2 hover:bg-gray-900 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
}
