"use client";
import { Flame, Target, Plus, Pause, Play, Award, CheckCircle, Rocket } from "lucide-react";

const icons = { Flame, Target, Plus, Pause, Play, Award, CheckCircle, Rocket };
export default function Icon({ name, className }) {
  const Cmp = icons[name] || Target;
  return <Cmp className={className} />;
}

