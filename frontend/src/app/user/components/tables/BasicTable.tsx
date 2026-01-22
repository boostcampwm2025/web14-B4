import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComprehensionTableRow } from './ComprehensionTableRow';
import { SolvedTableRow } from './SolvedTableRow';
import { BasicTableProps, ComprehensionData, SolvedData } from '../../types/table';

type TableType = 'comprehension' | 'solved';

export function BasicTable({ type, data }: BasicTableProps) {
  if (type === 'comprehension') {
    const comprehensionData = data as ComprehensionData[];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">카테고리</TableHead>
            <TableHead className="w-[12%] text-center">푼 문제</TableHead>
            <TableHead className="w-[10%] text-center">상</TableHead>
            <TableHead className="w-[10%] text-center">중</TableHead>
            <TableHead className="w-[10%] text-center">하</TableHead>
            <TableHead className="w-[38%] text-center">평균 이해도</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comprehensionData.map((item) => (
            <ComprehensionTableRow key={item.category} item={item} />
          ))}
        </TableBody>
      </Table>
    );
  }

  const solvedData = data as SolvedData[];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%]">카테고리</TableHead>
          <TableHead className="w-[20%] text-center">푼 문제</TableHead>
          <TableHead className="w-[20%] text-center">전체 문제</TableHead>
          <TableHead className="w-[40%] text-center">진행률</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {solvedData.map((category) => (
          <SolvedTableRow key={category.category} category={category} />
        ))}
      </TableBody>
    </Table>
  );
}
