import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { DollarSign } from 'lucide-react'
import { title } from 'process'

const EventStatCard = ({
    title,
    value,
    icon
}: {
    title: string,
    value: string,
    icon: React.ReactNode
}) => {
    return (
        <>
            <Card className="bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                </CardContent>
            </Card>
        </>
    )
}

export default EventStatCard