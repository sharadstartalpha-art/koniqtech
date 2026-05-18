import {
    PrismaClient,
    Industry,
    UserRole,
    SubscriptionStatus,
    LeadStatus,
    QuoteStatus,
    JobStatus
} from "@prisma/client"

import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    const password = await bcrypt.hash(
        "Koniq@Admin2026",
        10
    )

    /*
    =====================================
    ORG
    =====================================
    */

    const org = await prisma.organization.create({
        data: {
            name: "Elite Roofing Solutions",

            slug: "elite-roofing-us",

            industry: Industry.roofing,

            plan: "pro",

            email: "admin@eliteroofingusa.com",

            phone: "+1-469-555-1000",

            address:
                "Dallas, Texas, USA",

            users: {
                create: [

                    {
                        name: "Michael Carter",

                        email:
                            "owner@eliteroofingusa.com",

                        passwordHash:
                            password,

                        role:
                            UserRole.owner
                    },

                    {
                        name:
                            "Sarah Williams",

                        email:
                            "sales@eliteroofingusa.com",

                        passwordHash:
                            password,

                        role:
                            UserRole.sales
                    },

                    {
                        name:
                            "David Wilson",

                        email:
                            "tech@eliteroofingusa.com",

                        passwordHash:
                            password,

                        role:
                            UserRole.technician
                    }

                ]
            }
        },

        include: {
            users: true
        }
    })

    /*
    =====================================
    SETTINGS
    =====================================
    */

    await prisma.organizationSettings.create({
        data: {

            orgId: org.id,

            timezone:
                "America/Chicago",

            currency:
                "USD",

            branding: {
                company:
                    "Elite Roofing Solutions",

                locale:
                    "en-US"
            },

            integrations: {

                paypal: {

                    enabled: true,

                    provider:
                        "paypal",

                    environment:
                        "live"
                },

                sms:
                    "twilio",

                email:
                    "resend"
            }
        }
    })

    /*
    =====================================
    PAYPAL SUBSCRIPTION
    =====================================
    */

    await prisma.subscription.create({
        data: {

            orgId:
                org.id,

            provider:
                "paypal",

            externalId:
                "PAYPAL-SUB-US-10001",

            plan:
                "pro",

            status:
                SubscriptionStatus.active,

            renewAt:
                new Date(
                    "2026-06-20"
                )
        }
    })

    /*
    =====================================
    PIPELINE
    =====================================
    */

    const pipeline =
        await prisma.pipeline.create({

            data: {

                orgId:
                    org.id,

                name:
                    "US Roofing Sales",

                stages: {

                    create: [

                        {
                            name:
                                "New Lead",

                            position:
                                1
                        },

                        {
                            name:
                                "Inspection",

                            position:
                                2
                        },

                        {
                            name:
                                "Estimate Sent",

                            position:
                                3
                        },

                        {
                            name:
                                "Insurance Review",

                            position:
                                4
                        },

                        {
                            name:
                                "Closed Won",

                            position:
                                5
                        }

                    ]
                }
            },

            include: {
                stages: true
            }
        })

    /*
    =====================================
    LEAD
    =====================================
    */

    const lead =
        await prisma.lead.create({

            data: {

                orgId:
                    org.id,

                source:
                    "Google Ads",

                firstName:
                    "Robert",

                lastName:
                    "Johnson",

                email:
                    "robert.johnson@email.com",

                phone:
                    "+1-214-555-1122",

                address:
                    "Dallas, TX",

                industry:
                    Industry.roofing,

                status:
                    LeadStatus.qualified,

                notes:
                    "Insurance claim inspection request"
            }
        })

    /*
    =====================================
    CUSTOMER
    =====================================
    */

    const customer =
        await prisma.customer.create({

            data: {

                orgId:
                    org.id,

                leadId:
                    lead.id,

                firstName:
                    "Robert",

                lastName:
                    "Johnson",

                companyName:
                    "Johnson Properties",

                email:
                    lead.email,

                phone:
                    lead.phone,

                city:
                    "Dallas",

                state:
                    "Texas",

                zip:
                    "75001",

                address:
                    "Dallas TX USA"
            }
        })

    /*
    =====================================
    DEAL
    =====================================
    */

    const wonStage =
        pipeline.stages.find(
            s =>
                s.name ===
                "Estimate Sent"
        )

    await prisma.deal.create({

        data: {

            orgId:
                org.id,

            customerId:
                customer.id,

            stageId:
                wonStage!.id,

            title:
                "Residential Roof Replacement",

            value:
                18500,

            probability:
                85,

            expectedClose:
                new Date(
                    "2026-05-30"
                )
        }
    })

    /*
    =====================================
    QUOTE
    =====================================
    */

    const quote =
        await prisma.quote.create({

            data: {

                orgId:
                    org.id,

                customerId:
                    customer.id,

                quoteNumber:
                    "US-ROOF-1001",

                subtotal:
                    18500,

                tax:
                    1480,

                total:
                    19980,

                status:
                    QuoteStatus.sent,

                validUntil:
                    new Date(
                        "2026-06-10"
                    ),

                items: {

                    create: [

                        {
                            itemName:
                                "Roof Replacement",

                            qty:
                                1,

                            price:
                                15000,

                            total:
                                15000
                        },

                        {
                            itemName:
                                "Premium Shingles",

                            qty:
                                1,

                            price:
                                3500,

                            total:
                                3500
                        }

                    ]
                }
            }
        })

    /*
    =====================================
    JOB
    =====================================
    */

    await prisma.job.create({

        data: {

            orgId:
                org.id,

            customerId:
                customer.id,

            quoteId:
                quote.id,

            title:
                "Dallas Roof Install",

            status:
                JobStatus.scheduled,

            scheduledDate:
                new Date(
                    "2026-05-25"
                ),

            roofingProject: {

                create: {

                    roofType:
                        "Residential",

                    material:
                        "Architectural Shingles",

                    areaSqft:
                        3200,

                    insuranceClaim:
                        true
                }
            }
        }
    })

    /*
    =====================================
    INVOICE
    =====================================
    */

    await prisma.invoice.create({

        data: {

            orgId:
                org.id,

            customerId:
                customer.id,

            amount:
                19980,

            status:
                "pending",

            dueDate:
                new Date(
                    "2026-06-15"
                )
        }
    })

    /*
    =====================================
    AUTOMATION
    =====================================
    */

    await prisma.automation.create({

        data: {

            orgId:
                org.id,

            name:
                "Quote Followup",

            triggerEvent:
                "quote_sent",

            steps: {

                create: [

                    {

                        actionType:
                            "send_email",

                        config: {
                            delay:
                                "24h"
                        },

                        position:
                            1
                    },

                    {

                        actionType:
                            "paypal_invoice",

                        config: {
                            provider:
                                "paypal"
                        },

                        position:
                            2
                    }

                ]
            }
        }
    })

    /*
    =====================================
    PLATFORM ADMIN
    =====================================
    */

    await prisma.adminUser.create({

        data: {

            email:
                "admin@koniqtech.com",

            passwordHash:
                password,

            role:
                "super_admin"
        }
    })

    console.log(
        "USA / EU PayPal seed completed"
    )
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async e => {

    console.error(e)

    await prisma.$disconnect()

    process.exit(1)

})