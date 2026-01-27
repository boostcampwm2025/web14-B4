import { TableCell, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ComprehensionData } from '../../types/table';

interface ComprehensionTableRowProps {
  item: ComprehensionData;
}

const getScoreColor = (score: number) => {
  if (score >= 4.5) return 'text-green-600';
  if (score >= 3.5) return 'text-blue-600';
  if (score >= 2.5) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadgeVariant = (
  score: number,
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (score >= 4.5) return 'default';
  if (score >= 3.5) return 'secondary';
  if (score >= 2.5) return 'outline';
  return 'destructive';
};

const getScoreLabel = (score: number) => {
  if (score >= 4.5) return '매우 우수';
  if (score >= 3.5) return '우수';
  if (score >= 2.5) return '보통';
  return '미흡';
};

export function ComprehensionTableRow({ item }: ComprehensionTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{item.category}</TableCell>
      <TableCell className="text-center">{item.totalSolved}개</TableCell>
      <TableCell className="text-center text-green-600 font-semibold">{item.high}</TableCell>
      <TableCell className="text-center text-yellow-600 font-semibold">{item.normal}</TableCell>
      <TableCell className="text-center text-red-600 font-semibold">{item.low}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Progress value={(item.comprehensionScore / 5) * 100} className="flex-1" />
          <div className="flex flex-col items-end gap-1">
            <span className={`text-sm font-bold ${getScoreColor(item.comprehensionScore)}`}>
              {item.comprehensionScore.toFixed(2)} / 5
            </span>
            <Badge variant={getScoreBadgeVariant(item.comprehensionScore)}>
              {getScoreLabel(item.comprehensionScore)}
            </Badge>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
