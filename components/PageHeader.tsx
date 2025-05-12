interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold text-[#3A8144]">{title}</h1>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
} 