import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { cards ,users } from '@/data'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react'
import CountUp from 'react-countup';
import { Stackedchart } from './Stackedchart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiArrowUpRight } from "react-icons/fi";


const Mainbar = () => {
  return (
    <div className=' text-white  w-11/12  mx-auto  px-8 py-2 '>
      <div className='p-2'>
        <div className="flex flex-row justify-between gap-4">
          <h2 className='font-bold text md:text-[22px] text-[20px]'>Welcome Back, Taylor</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <span className="sr-only">Toggle user menu</span>
            <AvatarFallback>TY</AvatarFallback>
          </Avatar>
              {/* <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                
              </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/sign-in">
              <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
              
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>
        
        <p className='mt-2 tracking-wider text-sm font-light'>The following are insights of progress</p>
      </div>

      {/* Cards */}

      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 mx-auto'>
      
        {cards.map(card => (
        <Card key={card.id} x-chunk="dashboard-01-chunk-0  ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium flex items-center justify-between w-full">
              {card.name}
              <card.icon className="h-4 w-4 text-muted-foreground mr-2 " />
              
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold text-blue-700">
              <CountUp end={parseInt(card.stats, 10)} duration={2.5} />
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
              {/* Additional dynamic content can go here */}
            </p>
          </CardContent>
        </Card>
          ))}
          
          
      </div>


      

      <div className='mt-12 flex  flex-col md:flex-row gap-6 p-2  '>
        {/* Charts */}
        <div className=" lg:w-2/5">
        < Stackedchart/>
        </div>
          

          {/* Table for transcation */}
          <div className="lg:w-3/5">
            <div className="">
              <Button className="ml-auto gap-1 mb-2 bg-blue-500 px-6 py-2 flex flex-row items-center text-white">
                <Link href="#" className="flex flex-row items-center">
                  View All
                  <FiArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            <Card>
              <Table>
                <TableCaption>A list of your recent transactions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className={['Pending', 'Failed'].includes(user.status) ? 'text-red-500' : ''}>
                        {user.status}
                      </TableCell>
                      <TableCell className="text-right">{user.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>


          </div>
          
      </div>

      
    </div>
  )
}

export default Mainbar