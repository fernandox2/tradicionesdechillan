import { redirect } from "next/navigation";

export default function WebmailPage() {
    redirect('https://ntx-05-lon-cp41.netexplora.com:2096')
  return (
    <div>
      <h1>Webmail</h1>
    </div>
  );
}