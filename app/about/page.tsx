"use client";
import React, { useEffect, useState } from 'react';

function Page() {
  /** const [page, setPage] = useState<any[]>([]);
 
   useEffect(() => {
     fetch('http://127.0.0.1:8080/api/users')
       .then(res => res.json())
       .then(data => setPage(data.diner_auth)) // Accessing the 'data' property from the fetched response
       .catch(error => console.error('Error fetching products:', error));
   }, []); // Adding an empty dependency array to run the effect only once */

  return (
    <div className="h-[32rem] w-full">
      <h1>this is about page</h1>
    </div>
  );
}

export default Page;
