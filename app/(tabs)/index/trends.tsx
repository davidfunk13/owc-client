import type { FC } from "react";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Screen } from "@/components/Screen/Screen";

const HomeTrends: FC = () => {
  return (
    <Screen scroll>
      <Card>
        <EmptyState
          title="No trend data yet"
          description="Track at least a few games to see win rate, role, and hero trends over time."
        />
      </Card>
    </Screen>
  );
};

export default HomeTrends;
