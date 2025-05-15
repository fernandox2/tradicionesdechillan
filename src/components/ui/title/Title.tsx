import React from 'react'

interface Props {
    title: string;
    subtitle?: string;
    className?: string;
}

export const Title = ({title, subtitle, className}: Props) => {
  return (
    <div className={`mt-3 ${ className } flex items-center gap-2`}>
        <h1 className={`antialiased text-xl`}>{title} - </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
  )
}
