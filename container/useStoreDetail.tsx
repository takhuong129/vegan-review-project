import { useState, useEffect } from 'react';
import { StoreInfo } from '@/container/StoreConstant';

const useStoreDetail = (id: string) => {
    const [storeDetail, setStoreDetail] = useState<StoreInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoreDetail = async () => {
            try {
                const res = await fetch(`http://localhost:5000/product/${id}`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setStoreDetail(data);
            } catch (error) {
                setError("error");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetail();
    }, [id]);

    return { storeDetail, loading, error };
};

export default useStoreDetail;
