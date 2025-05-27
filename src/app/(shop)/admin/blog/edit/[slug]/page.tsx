import React from 'react';
import { Title } from '@/components'; 
import { redirect } from 'next/navigation';
import { ArticleForm } from '../../ui/ArticleForm';
import { getArticleBySlug } from '@/actions/article/get-article-by-slug';
import { auth } from '@/auth.config';

interface Props {
    params: {
      slug: string;
    }
  }

  export default async function ArticleEditPage({ params }: Props) {

    const { slug } = params;

    const session = await auth();

    if (!session) redirect("/");

    const { id } = session?.user;

    const [ article ] = await Promise.all([
        getArticleBySlug(slug)
      ]);

      if ( !article && slug !== 'new' ) {
        redirect('/admin/blog')
      }

  return (
   <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
         <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
           
           <div className="border-b border-slate-200 pb-5 mb-6">
             <Title 
               title={ 'Editar Artículo'} 
               subtitle={'Rellena los campos para crear un producto.'}
             />
           </div>
           
           <ArticleForm article={article ?? {}} userId={id} />
         </div>
       </div>
  );
}