import prisma from "@/shared/lib/prisma"
import GettingStarted from "@/components/dashboard/GettingStarted";
import NextAction from "@/components/dashboard/NextAction";
import { auth } from "@/auth"
import WelcomeModal from "@/components/dashboard/WelcomeModal";
import Link from "next/link"

import { redirect } from "next/navigation"

import {

Users,
Briefcase,
UserPlus,
ArrowRight

} from "lucide-react"

export const dynamic="force-dynamic"

export default async function DashboardPage(){

const session=
await auth()

if(!session?.user){

redirect("/login")

}

const role=

(session.user as any)
?.role

if(

role===

"super_admin"

){

redirect(
"/admin/dashboard"
)

}

const dbUser=

await prisma.user.findUnique({

where:{

email:
session.user.email!

},

include:{

organization:true

}

})

if(!dbUser){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

User not found

</div>

)

}

const [
    leads,
    customers,
    jobs,
    teamMembers,
    invoices,
    recentLeads,
    recentCustomers,
    recentJobs,
] = await Promise.all([
    prisma.lead.count({
        where: {
            orgId: dbUser.orgId,
        },
    }),

    prisma.customer.count({
        where: {
            orgId: dbUser.orgId,
        },
    }),

    prisma.job.count({
        where: {
            orgId: dbUser.orgId,
        },
    }),

    prisma.user.count({
        where: {
            orgId: dbUser.orgId,
        },
    }),

    prisma.invoice.count({
        where: {
            orgId: dbUser.orgId,
        },
    }),

    prisma.lead.findMany({
        where: {
            orgId: dbUser.orgId,
        },
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
    }),

    prisma.customer.findMany({
        where: {
            orgId: dbUser.orgId,
        },
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
    }),

    prisma.job.findMany({
        where: {
            orgId: dbUser.orgId,
        },
        take: 3,
        orderBy: {
            id: "desc",
        },
    }),
]);

const subscriptionEnds=

dbUser.organization
?.subscriptionEndsAt

const daysLeft=

subscriptionEnds

?

Math.ceil(

(

new Date(
subscriptionEnds
).getTime()

-

Date.now()

)

/

1000

/

60

/

60

/

24

)

:

null

const expired=

daysLeft!==null

&&

daysLeft<0

const onboarding = {
    company: Boolean(dbUser.organization?.name),

    organization:
        Boolean(dbUser.organization?.timezone) &&
        Boolean(dbUser.organization?.currency),

    branding: Boolean(dbUser.organization?.logo),

    team: teamMembers > 1,

    lead: leads > 0,

    customer: customers > 0,

    job: jobs > 0,

    invoice: invoices > 0,
};

const nextAction =
    !onboarding.company
        ? {
              title: "Setup Company",
              description:
                  "Add your business information so customers know who you are.",
              href: "/settings/company",
          }
        : !onboarding.organization
        ? {
              title: "Complete Organization Settings",
              description:
                  "Configure your timezone, currency and business settings.",
              href: "/settings/organization",
          }
        : !onboarding.branding
        ? {
              title: "Upload Company Logo",
              description:
                  "Your logo will appear on Quotes, Invoices and customer documents.",
              href: "/settings/branding",
          }
        : !onboarding.team
        ? {
              title: "Invite Your Team",
              description:
                  "Invite employees so they can access your CRM.",
              href: "/team",
          }
        : !onboarding.lead
        ? {
              title: "Create Your First Lead",
              description:
                  "Leads are potential customers waiting to become clients.",
              href: "/leads/new",
          }
        : !onboarding.customer
        ? {
              title: "Create Your First Customer",
              description:
                  "Convert a lead or create a customer manually.",
              href: "/customers/new",
          }
        : !onboarding.job
        ? {
              title: "Create Your First Job",
              description:
                  "Jobs help you schedule and manage work for customers.",
              href: "/jobs/new",
          }
        : !onboarding.invoice
        ? {
              title: "Generate Your First Invoice",
              description:
                  "Invoices help you bill customers and track payments.",
              href: "/invoices/new",
          }
        : null;


const completedSteps =
Object.values(onboarding).filter(Boolean).length;

const totalSteps =
Object.keys(onboarding).length;

const progress =
Math.round((completedSteps / totalSteps) * 100);



const onboardingSteps = [
    {
        title: "Setup Company",
        completed: onboarding.company,
        href: "/settings/company",
    },
    {
        title: "Organization Settings",
        completed: onboarding.organization,
        href: "/settings/organization",
    },
    {
        title: "Upload Company Logo",
        completed: onboarding.branding,
        href: "/settings/branding",
    },
    {
        title: "Invite Team",
        completed: onboarding.team,
        href: "/team",
    },
    {
        title: "Create First Lead",
        completed: onboarding.lead,
        href: "/leads/new",
    },
    {
        title: "Create First Customer",
        completed: onboarding.customer,
        href: "/customers/new",
    },
    {
        title: "Create First Job",
        completed: onboarding.job,
        href: "/jobs/new",
    },
    {
        title: "Generate First Invoice",
        completed: onboarding.invoice,
        href: "/invoices/new",
    },
];




return(

<div className="space-y-6">
   {!dbUser.welcomeSeen && <WelcomeModal />}
<div>

<h1 className="
text-4xl
font-semibold
tracking-tight
">

Dashboard

</h1>

<p className="
text-sm
text-slate-500
mt-1
">

Welcome back,

{

dbUser.name ||

"User"

}

</p>

</div>


{progress < 25 ? (
    <GettingStarted
        progress={progress}
        steps={onboardingSteps}
    />
) : progress < 100 && nextAction ? (
    <NextAction
        title={nextAction.title}
        description={nextAction.description}
        href={nextAction.href}
        progress={progress}
    />
) : null}


<div className="
grid
md:grid-cols-3
gap-4
">

<MetricCard

title="Leads"

value={leads}

href="/leads"

icon={<UserPlus size={16}/>}

/>

<MetricCard

title="Customers"

value={customers}

href="/customers"

icon={<Users size={16}/>}

/>

<MetricCard

title="Jobs"

value={jobs}

href="/jobs"

icon={<Briefcase size={16}/>}

/>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<div className="
flex
justify-between
items-start
">

<div>

<h2 className="
text-2xl
font-semibold
">

Subscription

</h2>

<div className="
mt-6
space-y-3
text-sm
">

<p>

Plan

<span className="
font-semibold
ml-2
">

{

dbUser.organization
?.plan

||

"free"

}

</span>

</p>

<p>

Expires

<span className="
font-semibold
ml-2
">

{

subscriptionEnds

?

new Date(

subscriptionEnds

).toLocaleDateString()

:

"No subscription"

}

</span>

</p>

</div>

{

daysLeft!==null

&&

!expired

&& (

<div className="
mt-5

inline-flex

px-3
py-1

rounded-full

bg-green-50

text-green-700

text-sm
font-medium
">

{

daysLeft

}

days remaining

</div>

)

}

{

expired && (

<div className="
mt-5

inline-flex

px-3
py-1

rounded-full

bg-red-50

text-red-700

text-sm
font-medium
">

Subscription expired

</div>

)

}

</div>

<Link

href="/billing"

className="
h-10

px-5

rounded-xl

border

text-sm

font-medium

flex
items-center
gap-2

hover:bg-slate-50
"

>

Manage

<ArrowRight
size={14}
/>

</Link>

</div>

</div>

<div className="
grid
md:grid-cols-3
gap-4
">

<ActivityCard
    title="Recent Leads"
    items={recentLeads.map(
        x => `${x.firstName} ${x.lastName}`
    )}
    href="/leads/new"
    action="Create First Lead"
    description="You haven't created any leads yet."
/>

<ActivityCard
    title="Recent Customers"
    items={recentCustomers.map(
        x => `${x.firstName} ${x.lastName}`
    )}
    href="/customers/new"
    action="Create First Customer"
    description="No customers yet."
/>

<ActivityCard
    title="Recent Jobs"
    items={recentJobs.map(
        x => x.title
    )}
    href="/jobs/new"
    action="Create First Job"
    description="No jobs have been created."
/>

</div>

</div>

)

}

function MetricCard({

title,
value,
href,
icon

}:any){

return(

<Link

href={href}

className="
bg-white
border
rounded-3xl
p-6

hover:border-slate-300

transition
"

>

<div className="
flex
justify-between
items-center
">

<p className="
text-sm
text-slate-500
">

{title}

</p>

{icon}

</div>

<h2 className="
text-5xl
font-semibold
mt-4
">

{value}

</h2>

</Link>

)

}

function ActivityCard({
    title,
    items,
    href,
    action,
    description
}: any){

return(

<div className="
bg-white
border
rounded-3xl
p-6
">

<h3 className="
font-medium
mb-5
">

{title}

</h3>

<div className="
space-y-2
">

{

items.length===0

?

<div className="rounded-2xl border border-dashed p-6 text-center">

    <p className="text-sm font-medium">
        {description}
    </p>

    <Link
        href={href}
        className="inline-flex mt-4 rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition"
    >
        {action}
    </Link>

</div>

:

items.map(

(x:any,i:number)=>(

<div

key={i}

className="
text-sm

bg-slate-50

rounded-xl

px-4
py-3
"

>

{x}

</div>

)

)

}

</div>

</div>

)

}