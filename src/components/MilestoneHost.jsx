"use client";
import MilestoneToast from "@/components/MilestoneToast";
import { useApp } from "@/context/AppContext";

export default function MilestoneHost() {
  const { milestoneShow, setMilestoneShow, milestoneValue } = useApp();
  
  return (
    <MilestoneToast 
      show={milestoneShow} 
      milestone={milestoneValue} 
      onClose={() => setMilestoneShow(false)} 
    />
  );
}
