
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Moon, BarChart, Save, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import SleepQualityChart from './SleepQualityChart';
import { useSleepRecords } from '@/hooks/use-sleep-records';

// Define the schema for sleep record form validation
const sleepRecordSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  hoursSlept: z.number({
    required_error: "Hours slept is required.",
  }).min(0, {
    message: "Hours must be at least 0.",
  }).max(24, {
    message: "Hours cannot exceed 24.",
  }),
  quality: z.enum(["Poor", "Fair", "Good", "Excellent"], {
    required_error: "Quality rating is required.",
  }),
  wokeUpDuringNight: z.boolean().default(false),
  notes: z.string().optional(),
});

// Define the type based on the schema
export type SleepRecord = z.infer<typeof sleepRecordSchema>;

const SleepTracker = () => {
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { records, addRecord } = useSleepRecords();
  
  const form = useForm<z.infer<typeof sleepRecordSchema>>({
    resolver: zodResolver(sleepRecordSchema),
    defaultValues: {
      date: new Date(),
      hoursSlept: 8,
      quality: "Good",
      wokeUpDuringNight: false,
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof sleepRecordSchema>) => {
    addRecord(data);
    toast({
      title: "Sleep record saved",
      description: "Your sleep record has been successfully saved.",
    });
  };

  // Conditional rendering based on device size
  const FormContent = () => (
    <div className="p-4 space-y-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <input 
                    type="date" 
                    className="input-glass w-full p-2 rounded-md"
                    value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hoursSlept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours Slept</FormLabel>
                <FormControl>
                  <input 
                    type="number" 
                    className="input-glass w-full p-2 rounded-md"
                    min="0"
                    max="24"
                    step="0.5"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Quality</FormLabel>
              <FormControl>
                <select 
                  className="input-glass w-full p-2 rounded-md"
                  onChange={(e) => field.onChange(e.target.value as any)}
                  value={field.value}
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="wokeUpDuringNight"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Woke up during the night?</FormLabel>
                <FormDescription>
                  Did you wake up during the night?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <textarea 
                  className="input-glass w-full p-2 rounded-md h-24 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary/90 transition-colors rounded-lg flex items-center justify-center space-x-2 text-primary-foreground"
        >
          <Save size={16} />
          <span>Save Sleep Record</span>
        </button>
      </form>
    </div>
  );

  return (
    <section id="tracker" className="min-h-screen py-24 px-6">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Sleep Tracker</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your sleep quality, duration, and patterns over time. View your sleep history and identify trends to improve your sleep health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Sleep Stats Card */}
          <div className="glass rounded-2xl overflow-hidden shadow-xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="p-5 glass border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-medium flex items-center">
                <Clock size={20} className="mr-2 text-primary" />
                Sleep Statistics
              </h3>
            </div>
            <div className="p-6">
              <SleepQualityChart />
            </div>
          </div>

          {/* Add Record Card */}
          <div className="glass rounded-2xl overflow-hidden shadow-xl animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="p-5 glass border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-medium flex items-center">
                <Plus size={20} className="mr-2 text-primary" />
                Add Sleep Record
              </h3>
            </div>
            <div className="p-6">
              {isDesktop ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full py-4 glass-light hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center space-x-2">
                      <Moon size={18} className="text-primary" />
                      <span>Record Your Sleep</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add Sleep Record</DialogTitle>
                    </DialogHeader>
                    <FormContent />
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="w-full py-4 glass-light hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center space-x-2">
                      <Moon size={18} className="text-primary" />
                      <span>Record Your Sleep</span>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Add Sleep Record</DrawerTitle>
                    </DrawerHeader>
                    <FormContent />
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
        </div>

        {/* Sleep History */}
        <div className="glass rounded-2xl overflow-hidden shadow-xl animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="p-5 glass border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-medium flex items-center">
              <BarChart size={20} className="mr-2 text-primary" />
              Sleep History
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn("border-b border-white/10")}>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead className="hidden md:table-cell">Woke Up</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No sleep records yet. Start tracking your sleep!
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record, index) => (
                    <TableRow key={index} className="border-b border-white/10">
                      <TableCell>{record.date.toLocaleDateString()}</TableCell>
                      <TableCell>{record.hoursSlept}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          record.quality === "Poor" && "bg-destructive/20 text-destructive",
                          record.quality === "Fair" && "bg-primary/20 text-primary",
                          record.quality === "Good" && "bg-accent/20 text-accent",
                          record.quality === "Excellent" && "bg-green-500/20 text-green-500"
                        )}>
                          {record.quality}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {record.wokeUpDuringNight ? 
                          <Eye className="text-destructive" size={16} /> : 
                          <Moon className="text-primary" size={16} />
                        }
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {record.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SleepTracker;
