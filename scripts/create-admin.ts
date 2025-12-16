import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'customer@sufopoc.com'
  const adminPassword = 'smart15game' // Default password - should be changed after first login
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  if (existingAdmin) {
    // Update existing admin user
    const admin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        name: 'Admin',
        role: UserRole.ADMIN,
        emailVerified: new Date(),
      },
    })
    console.log('✅ Admin user updated successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('⚠️  Please change the password after first login!')
  } else {
    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: UserRole.ADMIN,
        emailVerified: new Date(),
      },
    })
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('⚠️  Please change the password after first login!')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

