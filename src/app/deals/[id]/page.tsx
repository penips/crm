"use client";

import { useParams } from "next/navigation";
import { DealDetail } from "../_components/deal-detail";

export default function DealDetailPage() {
    const params = useParams();
    const dealId = params?.id as string;

    return <DealDetail dealId={dealId} />;
}

