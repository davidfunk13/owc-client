import type { FC } from "react";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Screen } from "@/components/Screen/Screen";

const HomeRecent: FC = () => {
  return (
    <Screen scroll>
      <Card>
        <EmptyState
          title="No recent games"
          description="Add a game from the + action to start filling this out."
        />
      </Card>
    </Screen>
  );
};

export default HomeRecent;
