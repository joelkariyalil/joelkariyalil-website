import Layout from '@/components/Layout';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

function ExperienceItem({ title, company, period, achievements }: ExperienceItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{
        y: springY,
        opacity: springOpacity,
        scale: springScale
      }}
      className="relative flex items-start gap-8 py-16"
    >
      {/* Timeline line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200" />
      
      {/* Timeline dot */}
      <div className="relative z-10 mt-1">
        <motion.div
          style={{ scale: springScale }}
          className="h-10 w-10 rounded-full border-4 border-white bg-gray-200 shadow-md"
        />
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mb-4">{company} • {period}</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {achievements.map((achievement, i) => (
            <li key={i} className="text-base">{achievement}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const professionalExperiences = [
    {
      title: "Software Test (Operations) Engineer",
      company: "Tally Solutions Pvt. Ltd.",
      period: "May 2023 - Aug 2024",
      achievements: [
        "Led the initial feasibility research and directed the migration of Jenkins from Windows to a Dockerized Linux environment on AWS, resulting in a projected 40% improvement in deployment efficiency and a 70% reduction in operational costs.",
        "Ensured 100% up-time of dockerized Dev, Staging, and Production Jenkins servers on Amazon EC2 Instances, mitigating data loss risks by 100% using AWS ECS & EKS facilities.",
        "Boosted workflow execution times by 99.35% using Python Multi-Pool Executor & AWS Compute Services and optimized MySQL in-code pings by 99% using Redis-like functionalities in Python.",
        "Designed solutions with Prompt Engg. with Generative AI (OpenAI APIs)-LLMs, and ML clustering models to automate test script writing processes, and improve automatic failure classification tasks.",
        "Published a Python open-source module - Context-Aware-Jenkins-Job-Transfers to enhance workflow efficiencies by over 80% with the help of several multi-disciplinary mentors."
      ]
    },
    {
      title: "AI and ML Intern",
      company: "AI Robosoft Pvt. Ltd.",
      period: "Feb 2023 - Apr 2023",
      achievements: [
        "Collaborated on state-of-the-art projects in AI and ML at AI Robosoft, with a focus on healthcare applications.",
        "Developed and implemented ML models for specific applications, utilizing Python and frameworks like TensorFlow and PyTorch.",
        "Utilized various algorithms (e.g., VGG19, ResNet50) to train models and optimize performance."
      ]
    }
  ];

  const education = [
    {
      title: "M.Sc., Data and Computational Science",
      company: "University College Dublin (UCD)",
      period: "Sept 2024 - Present",
      achievements: [
        "Modules include ML and AI, Regression and Statistical Analysis, Statistical Machine Learning, R, Python, Probability, and Statistics."
      ]
    },
    {
      title: "B.E., Computer Science and Engineering",
      company: "MVJ College of Engineering",
      period: "Sept 2019 – Sept 2023",
      achievements: [
        "GPA: 9.89/10, Gold Medalist",
        "Modules included Machine Learning and AI, Data Structures and Algorithms, Object Oriented Software Engineering, Theory of Computation, Deep Learning, and Differential Equations, Software Development Methodologies",
        "Authored and published three research papers, including one in the prestigious IEEE journals."
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-bold mb-16"
          >
            Experience
          </motion.h1>
          
          <div 
            ref={containerRef}
            className="relative"
          >
            {/* Progress bar */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-1 bg-gray-200 transform-origin-0"
              style={{ scaleX: scrollYProgress }}
            />

            <h2 className="text-2xl font-semibold mb-8">Professional Experience</h2>
            {professionalExperiences.map((experience, index) => (
              <ExperienceItem
                key={index}
                {...experience}
              />
            ))}

            <h2 className="text-2xl font-semibold mb-8 mt-16">Education</h2>
            {education.map((edu, index) => (
              <ExperienceItem
                key={index}
                {...edu}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 