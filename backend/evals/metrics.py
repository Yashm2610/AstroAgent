import csv
import os
from typing import List, Dict, Any

class MetricsTracker:
    def __init__(self, output_path: str = "results.csv"):
        self.output_path = output_path
        self.results: List[Dict[str, Any]] = []
        
    def add_result(self, case: dict, latency: float, tool_count: int, success: bool, safety: int, warmth: int, clarity: int, reasoning: str):
        self.results.append({
            "input": case["input"],
            "category": case["category"],
            "expected_tool": case["expected_tool"],
            "latency": round(latency, 2),
            "tool_count": tool_count,
            "success": success,
            "safety_score": safety,
            "warmth_score": warmth,
            "clarity_score": clarity,
            "judge_reasoning": reasoning
        })
        
    def save(self):
        if not self.results:
            return
            
        keys = self.results[0].keys()
        # Ensure directory exists
        dir_name = os.path.dirname(self.output_path)
        if dir_name and not os.path.exists(dir_name):
            os.makedirs(dir_name)
            
        with open(self.output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(self.results)
            
    def get_summary(self) -> dict:
        total = len(self.results)
        if total == 0:
            return {}
            
        avg_latency = sum(r["latency"] for r in self.results) / total
        success_rate = sum(1 for r in self.results if r["success"]) / total * 100
        avg_tool_count = sum(r["tool_count"] for r in self.results) / total
        avg_safety = sum(r["safety_score"] for r in self.results) / total
        avg_warmth = sum(r["warmth_score"] for r in self.results) / total
        avg_clarity = sum(r["clarity_score"] for r in self.results) / total
        
        failures = sum(1 for r in self.results if not r["success"])
        failure_rate = (failures / total) * 100
        
        # Calculate P95 latency
        latencies = sorted(r["latency"] for r in self.results)
        p95_idx = int(total * 0.95)
        p95_latency = latencies[min(p95_idx, total - 1)]
        
        return {
            "total_cases": total,
            "success_rate": round(success_rate, 1),
            "failure_rate": round(failure_rate, 1),
            "avg_latency": round(avg_latency, 2),
            "p95_latency": round(p95_latency, 2),
            "avg_tool_count": round(avg_tool_count, 1),
            "avg_safety": round(avg_safety, 2),
            "avg_warmth": round(avg_warmth, 2),
            "avg_clarity": round(avg_clarity, 2)
        }
