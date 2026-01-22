import { TableCell, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { SolvedData } from '../../types/table';

interface SolvedTableRowProps {
  category: SolvedData;
}

export function SolvedTableRow({ category }: SolvedTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{category.category}</TableCell>
      <TableCell className="text-center">{category.solvedQuizAmount}개</TableCell>
      <TableCell className="text-center">{category.totalQuizAmount}개</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Progress value={category.percentage} className="flex-1" />
          <span className="text-sm font-medium w-[3rem] text-right">{category.percentage}%</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
