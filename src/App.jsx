import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const NetworkVeins = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const numParticles = 100;

    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('touchend', handleMouseOut);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = p.x - mouse.x;
          let dy = p.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            let forceDirectionX = dx / dist;
            let forceDirectionY = dy / dist;
            let force = (mouse.radius - dist) / mouse.radius;
            let directionX = forceDirectionX * force * 2;
            let directionY = forceDirectionY * force * 2;
            
            p.x += directionX;
            p.y += directionY;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            let opacity = (1 - dist / mouse.radius) * 0.8;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        for (let j = i + 1; j < numParticles; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Opacity fades as distance increases
            let opacity = (1 - dist / 150) * 0.7;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('touchend', handleMouseOut);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-15 pointer-events-none" />;
};


const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~ACCESSGRANTEDSYSTEMHACKEDOVERRIDE';
    const characters = chars.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 7, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00e639';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full opacity-30" />;
};

const Preloader = () => {
  const [runFrame, setRunFrame] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRunFrame(prev => (prev === 0 ? 1 : 0));
    }, 150);

    const timeout = setTimeout(() => {
      setHasFinished(true);
      clearInterval(interval);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#05070a] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <MatrixRain />
      </div>
      <div className="relative z-10 flex flex-col items-center border border-primary/20 p-12 rounded-3xl bg-[#05070a]/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,230,57,0.25)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.img 
            animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src="/images/hacker_robot_1782435592072.png" 
            alt="Robot Hacker Logo" 
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-primary shadow-[0_0_50px_rgba(0,230,57,0.8)] object-cover mb-6" 
          />
          <motion.div 
            animate={{ textShadow: ["0px 0px 10px #00e639", "0px 0px 25px #00e639", "0px 0px 10px #00e639"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-primary font-bold text-3xl tracking-widest mb-6 text-center"
          >
            Welcome to my profile
          </motion.div>
        </motion.div>
        <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mt-4 pt-8 pb-2 relative">
          
          {/* Ghost Trail Runners */}
          {!hasFinished && [1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2.5, ease: "linear", delay: i * 0.08 }}
              className="absolute top-0 -translate-y-1/4 -translate-x-1/2 z-0 opacity-40"
            >
              <motion.span
                animate={{ y: [0, -10, 0], rotate: [15, 25, 10, 15] }}
                transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
                className="material-symbols-outlined text-5xl text-primary drop-shadow-[0_0_10px_rgba(0,230,57,0.3)] block blur-[1px]"
              >
                {runFrame === 0 ? 'directions_run' : 'directions_walk'}
              </motion.span>
            </motion.div>
          ))}

          {/* Main Runner / Cheerer */}
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute top-0 -translate-y-1/4 -translate-x-1/2 z-10"
          >
            <motion.span
              animate={hasFinished ? { y: [0, -25, 0], scale: [1, 1.3, 1], rotate: 0 } : { y: [0, -10, 0], rotate: [15, 25, 10, 15] }}
              transition={hasFinished ? { duration: 0.5, repeat: Infinity } : { repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
              className="material-symbols-outlined text-5xl text-white drop-shadow-[0_0_20px_rgba(0,230,57,1)] block"
            >
              {hasFinished ? 'accessibility_new' : (runFrame === 0 ? 'directions_run' : 'directions_walk')}
            </motion.span>
          </motion.div>
          
          <div className="w-full h-1.5 bg-[#12141c] rounded-full relative overflow-hidden mt-4 shadow-[0_0_15px_rgba(0,230,57,0.2)]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-primary to-white shadow-[0_0_15px_#00e639]"
            ></motion.div>
          </div>
        </div>
        <motion.p 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-primary/90 font-code-sm mt-8 uppercase tracking-widest"
        >
          &gt; INITIALIZING_ECOSYSTEM...
        </motion.p>
      </div>
    </motion.div>
  );
};

// Centralized Data with Images
const projectsData = [
  {
    id: "04",
    title: "ProfilePilot AI",
    desc: "An AI-powered career intelligence and professional profile optimization platform designed to maximize employability.",
    fullDesc: "ProfilePilot AI is an AI-powered career intelligence and professional profile optimization platform designed to help students, professionals, and job seekers maximize their employability. Unlike traditional ATS resume checkers that only evaluate resumes, ProfilePilot AI provides a comprehensive analysis of a user's entire professional presence by examining their resume, LinkedIn profile, GitHub account, portfolio website, technical skills, certifications, and target job descriptions.\n\nThe platform generates intelligent career insights through multiple AI-driven scores, including ATS compatibility, LinkedIn optimization, recruiter appeal, profile completeness, keyword optimization, personal branding, technical expertise, networking strength, and overall employability. It identifies weaknesses, highlights missing skills and keywords, rewrites resume and LinkedIn sections, compares profiles against industry standards, and provides personalized recommendations to improve visibility and hiring potential.\n\nProfilePilot AI also features job description matching, resume–LinkedIn consistency analysis, AI-powered mock interviews, recruiter simulations, GitHub and portfolio evaluation, skill gap analysis, salary prediction, career roadmap generation, and AI-powered content suggestions for LinkedIn. By combining advanced AI, natural language processing, and career analytics into a single platform, ProfilePilot AI acts as a complete AI career coach, enabling users to build a stronger professional brand.",
    tags: ["AI", "NLP", "React", "Node.js", "Analytics"],
    url: "https://github.com/kkiran47/ProfilePilot-AI",
    image: "/images/profilepilot_ai_mockup.png",
    category: "AI/ML"
  },
  {
    id: "01",
    title: "Cloudsphere_ai",
    desc: "Smart cloud storage platform that not only stores files but also understands, analyzes, organizes, secures, and lets users interact with their documents using AI.",
    tags: ["React", "AI", "Cloud"],
    url: "https://github.com/kkiran47/Cloudsphere_ai",
    image: "/images/project_cloudsphere_1782436065792.png",
    category: "AI/ML"
  },
  {
    id: "02",
    title: "college_complants",
    desc: "End-to-end complaint management system with MongoDB-backed workflow automation.",
    tags: ["MERN", "Automation"],
    url: "https://github.com/kkiran47/college_complants",
    image: "/images/project_college_complaints_1782436078827.png",
    category: "Web Dev"
  },
  {
    id: "03",
    title: "customer-churn",
    desc: "Machine learning model predicting customer churn based on historical data.",
    tags: ["Python", "ML"],
    url: "https://github.com/kkiran47/customer-churn-prediction",
    image: "/images/project_customer_churn_1782436089289.png",
    category: "AI/ML"
  },
  {
    id: "04",
    title: "face_auth-voting",
    desc: "Biometric authentication platform using Node.js for secure voting.",
    tags: ["Node.js", "Biometrics"],
    url: "https://github.com/kkiran47/face_auth-voting_system",
    image: "/images/project_face_auth_1782436100613.png",
    category: "Web Dev"
  },
  {
    id: "05",
    title: "greenmind-AI",
    desc: "Full-stack smart farming platform with real-time crop monitoring.",
    tags: ["React", "ML"],
    url: "https://github.com/kkiran47/greenmind-AI",
    image: "/images/project_greenmind_1782436111772.png",
    category: "AI/ML"
  },
  {
    id: "06",
    title: "sign-language-translator",
    desc: "Real-time sign language translation tool using computer vision and neural networks.",
    tags: ["CV", "Python"],
    url: "https://github.com/kkiran47/sign-language--translator",
    image: "/images/project_sign_language_1782436121956.png",
    category: "AI/ML"
  },
  {
    id: "07",
    title: "trading_bot",
    desc: "Automated trading bot implementing custom algorithmic strategies for crypto/stock markets.",
    tags: ["Python", "Finance"],
    url: "https://github.com/kkiran47/trading_bot",
    image: "/images/project_trading_bot_1782436136913.png",
    category: "Other"
  },
  {
    id: "08",
    title: "vidyutracker",
    desc: "System for tracking electrical assets and consumption.",
    tags: ["IoT", "Analytics"],
    url: "https://github.com/kkiran47/vidyutracker",
    image: "/images/project_vidyutracker_1782436148515.png",
    category: "Web Dev"
  }
];

const skillsData = [
  { name: "React", category: "Frontend", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Node.js", category: "Backend", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "MongoDB", category: "Database", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "Python", category: "Language", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "JavaScript", category: "Language", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TensorFlow", category: "AI/ML", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
  { name: "C++", category: "Language", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  { name: "Firebase", category: "Core", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
  { name: "Express", category: "Backend", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
  { name: "Tailwind", category: "Frontend", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "MySQL", category: "Database", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "SQL", category: "Database", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg" },
  { name: "LangChain", category: "AI/ML", image: "https://api.iconify.design/simple-icons:langchain.svg?color=%2300e639" },
  { name: "RAG", category: "AI/ML", image: "https://api.iconify.design/carbon:machine-learning-model.svg?color=%2300e639" },
  { name: "Vector Embeddings", category: "AI/ML", image: "https://api.iconify.design/carbon:scatter-matrix.svg?color=%2300e639" },
  { name: "Scikit-Learn", category: "AI/ML", image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
  { name: "Git", category: "Tools", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "Docker", category: "DevOps", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "AWS", category: "Cloud", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" }
];

const experienceData = [
  {
    role: "Web Development Intern",
    company: "Royal Acquisition Private Limited",
    period: "March 2026 – June 2026",
    desc: [
      "Redesigned the company website with responsive layouts and modern UI/UX improvements, decreasing mobile bounce rate by ~20% and achieving consistent experience across desktop, tablet, and mobile.",
      "Executed frontend performance and accessibility enhancements, accelerating average page load time by ~15%, resolved 10+ UI bugs, and ensured cross-browser compatibility across Chrome, Firefox, and Safari."
    ]
  },
  {
    role: "Full Stack / Web Development Intern",
    company: "ApexPlanet",
    period: "June 2025 – July 2025",
    desc: [
      "Built 8+ React.js modules with code splitting & lazy loading, accelerating page load time by 20% and improving Lighthouse scores.",
      "Shipped 5+ RESTful APIs in Node.js/Express.js with input validation and MongoDB persistence — handling 1,000+ records with zero data integrity issues.",
      "Refactored UI into a reusable React component library, decreasing code duplication by ~25% and accelerating feature development time.",
      "Owned Git branching strategy & code reviews for a 4-member team, decreasing merge conflicts by 30% and improving PR cycle time."
    ]
  },
  {
    role: "Google AI & ML Developer Intern",
    company: "EduSkills",
    period: "Oct 2024 – Dec 2024",
    desc: [
      "Developed full-stack AI solutions with React.js dashboards and Node.js/Express.js backends integrated with Python ML inference APIs — independently owning the end-to-end feature lifecycle.",
      "Engineered ML pipelines connecting Python models to Node.js REST APIs, achieving sub-200ms real-time inference and improving model accuracy from ~72% to 90%+ across 5 experimental pipelines.",
      "Refactored asynchronous backend processing logic in Node.js, reducing average API response latency by 40ms (12% gain) and improving system throughput for concurrent users.",
      "Deployed 3 end-to-end solutions on Render integrating React.js dashboards with ML-powered backends, supporting stable performance under concurrent production load."
    ]
  }
];

const achievementsData = [
  {
    title: "Knight Badge on LeetCode",
    desc: "Achieved the prestigious Knight badge on LeetCode by consistently performing well in global coding contests."
  },
  {
    title: "2-Star Coder on CodeChef",
    desc: "Earned a 2-Star rating on CodeChef, demonstrating strong problem-solving and competitive programming skills."
  },
  {
    title: "App Development Competition Winner",
    desc: "Secured a winning position in an App Development competition by building an innovative and functional application."
  }
];

const profilesData = [
  { name: "LeetCode", url: "https://leetcode.com/u/AcWeOEvsk47/", icon: "code" },
  { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/profile/kiranprasa729d", icon: "data_object" },
  { name: "CodeChef", url: "https://www.codechef.com/users/kkiran123", icon: "restaurant_menu" }
];

function App() {
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'projects'
  const [selectedProject, setSelectedProject] = useState(null); // For modal
  const [filter, setFilter] = useState('All'); // For projects view
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile menu
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const roles = ["Full Stack Developer", "Software Engineer", "AI Enthusiast", "System Architect"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let text = '';
    let timeout;

    const typeWriter = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        text = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        text = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }
      setTypedText(text);

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && text === currentRole) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && text === '') {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
      }
      timeout = setTimeout(typeWriter, typeSpeed);
    };
    
    if (!loading && currentView === 'home') {
      timeout = setTimeout(typeWriter, 1000);
    }

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(timeout);
    };
  }, [loading, currentView]);

  // View Switcher Handlers
  const goHome = (e) => {
    if (e) e.preventDefault();
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goProjects = (e) => {
    if (e) e.preventDefault();
    setCurrentView('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProjects = filter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  // PROJECT MODAL COMPONENT
  const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#05070a] border border-primary/20 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,230,57,0.15)] flex flex-col relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-primary/10">
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose}></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-gray-500 font-code-sm text-sm">Project_Details.exe</span>
              <button onClick={onClose} className="text-gray-400 hover:text-white material-symbols-outlined transition-colors">close</button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 md:p-12 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-[1.5rem] bg-[#12141c] border border-primary/20 flex items-center justify-center shadow-inner overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{project.title}</h2>
                  <span className="text-primary font-code-sm tracking-widest uppercase text-sm border border-primary/30 rounded-full px-4 py-1 bg-primary/5">{project.category}</span>
                </div>
              </div>
              
              <div className="bg-[#12141c] p-6 md:p-8 rounded-3xl border border-primary/10">
                <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {project.fullDesc || project.desc}
                </p>
                
                <h3 className="text-xl font-bold text-white mt-8 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-[#0a0c10] border border-primary/20 rounded-xl text-primary font-code-sm text-xs md:text-sm">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-black font-bold hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,230,57,0.4)] transition-all text-sm md:text-base">
                  View on GitHub <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-[#05070a] min-h-screen font-sans text-white overflow-x-hidden selection:bg-primary/30 selection:text-primary relative">
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {!loading && (
        <>
          <NetworkVeins />
          <div className="scanlines z-0 pointer-events-none opacity-20"></div>

          {/* Floating Pill Navbar */}
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-4 md:left-8 z-[50] flex items-center gap-6 md:gap-12 w-auto bg-[#05070a]/80 backdrop-blur-xl border border-primary/30 hover:border-primary/60 transition-all duration-500 rounded-full px-6 py-3 md:px-8 shadow-lg shadow-black/80"
          >
            <div className="flex items-center gap-8">
              <div onClick={goHome} className="text-primary font-bold text-2xl tracking-wider matrix-glow cursor-pointer hover:scale-105 transition-transform shrink-0">
                KIRAN
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-2 items-center text-sm font-medium bg-[#12141c]/50 p-1 rounded-full border border-primary/10">
                  <a onClick={goHome} className={`cursor-pointer px-5 py-2 rounded-full transition-all duration-300 font-bold ${currentView === 'home' ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,230,57,0.2)]' : 'text-gray-400 hover:bg-primary/10 hover:text-primary active:scale-95'}`}>
                    Home
                  </a>
                  <a href="#about" onClick={(e) => { if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-5 py-2 rounded-full text-gray-400 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary active:scale-95">
                    About
                  </a>
                  <a href="#experience" onClick={(e) => { if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('experience')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-5 py-2 rounded-full text-gray-400 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary active:scale-95">
                    Experience
                  </a>
                  <a href="#achievements" onClick={(e) => { if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('achievements')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-5 py-2 rounded-full text-gray-400 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary active:scale-95">
                    Achievements
                  </a>
                  <a onClick={goProjects} className={`cursor-pointer px-5 py-2 rounded-full transition-all duration-300 font-bold ${currentView === 'projects' ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,230,57,0.2)]' : 'text-gray-400 hover:bg-primary/10 hover:text-primary active:scale-95'}`}>
                    Projects
                  </a>
                  <a href="#contact" className="px-5 py-2 rounded-full text-gray-400 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary active:scale-95">
                    Contact
                  </a>
              </nav>
            </div>            
            <div className="flex items-center gap-4 shrink-0">
              <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(0,230,57,0.4)] transition-all font-bold text-sm active:scale-95">
                Contact Me
              </a>
              {/* Mobile Menu Toggle */}
              <div 
                className="md:hidden text-primary cursor-pointer hover:scale-110 transition-transform flex items-center justify-center w-10 h-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                 <span className="material-symbols-outlined text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
              </div>
            </div>
          </motion.header>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed top-24 left-1/2 w-[90%] z-[45] bg-[#05070a]/95 backdrop-blur-2xl border border-primary/30 rounded-[2rem] p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center gap-4 md:hidden"
              >
                <a onClick={() => { goHome(); setIsMobileMenuOpen(false); }} className={`cursor-pointer px-6 py-3 w-full text-center rounded-xl transition-all duration-300 font-bold ${currentView === 'home' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10 hover:text-primary'}`}>
                  Home
                </a>
                <a href="#about" onClick={(e) => { setIsMobileMenuOpen(false); if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-6 py-3 w-full text-center rounded-xl text-gray-300 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary">
                  About
                </a>
                <a href="#experience" onClick={(e) => { setIsMobileMenuOpen(false); if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('experience')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-6 py-3 w-full text-center rounded-xl text-gray-300 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary">
                  Experience
                </a>
                <a href="#achievements" onClick={(e) => { setIsMobileMenuOpen(false); if(currentView !== 'home') { e.preventDefault(); setCurrentView('home'); setTimeout(() => document.getElementById('achievements')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="px-6 py-3 w-full text-center rounded-xl text-gray-300 transition-all duration-300 font-bold hover:bg-primary/10 hover:text-primary">
                  Achievements
                </a>
                <a onClick={() => { goProjects(); setIsMobileMenuOpen(false); }} className={`cursor-pointer px-6 py-3 w-full text-center rounded-xl transition-all duration-300 font-bold ${currentView === 'projects' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10 hover:text-primary'}`}>
                  Projects
                </a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 mt-2 w-full text-center rounded-xl bg-primary text-black transition-all duration-300 font-bold hover:bg-primary/80 shadow-[0_0_20px_rgba(0,230,57,0.4)]">
                  Contact Me
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="relative z-10 w-full overflow-hidden">
            
            {/* HOME VIEW */}
            {currentView === 'home' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* HERO SECTION */}
                <section id="home" className="min-h-[100svh] pt-32 pb-20 flex flex-col justify-center relative px-6 md:px-16 max-w-7xl mx-auto w-full">
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start gap-6 relative z-10">
                      <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl text-gray-400 font-light">Hi, I'm 👋</motion.h2>
                      <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
                        Karanam <br/><span className="text-white">Kiran Prasad</span>
                      </motion.h1>
                      <motion.div variants={fadeUp} className="text-2xl md:text-3xl text-gray-400 flex items-center gap-2 font-light mt-2 h-10">
                          I am a <span className="text-primary font-bold min-w-[200px]">{typedText}<span className="cursor-blink text-primary">|</span></span>
                      </motion.div>
                      <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-lg mt-4 leading-relaxed font-light">
                        Building premium digital experiences with <strong className="text-white font-semibold">robust backend systems</strong> & <strong className="text-white font-semibold">intelligent workflows</strong>, focused on clarity, performance, and real-world usability.
                      </motion.p>
                      <motion.a variants={fadeUp} href="/Kiran_FullStack_Resume.pdf" download="Kiran_FullStack_Resume.pdf" className="mt-8 w-full sm:w-auto relative inline-flex group items-center justify-center px-8 py-4 rounded-xl bg-[#12141c] border border-primary/30 text-white hover:border-primary/80 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,230,57,0.2)]">
                        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="flex items-center gap-3 z-10 font-medium">
                          <span className="material-symbols-outlined text-primary">download</span> Download CV
                        </span>
                      </motion.a>
                      
                      {/* Social dock */}
                      <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-4 justify-start w-full sm:w-auto z-20">
                        <a href="https://github.com/kkiran47" target="_blank" rel="noreferrer" className="h-12 flex-1 sm:flex-none min-w-[3rem] px-[12px] rounded-full bg-[#12141c] border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(0,230,57,0.9)] transition-all duration-300 group overflow-hidden">
                          <i className="devicon-github-original text-2xl text-gray-400 group-hover:text-primary transition-colors"></i>
                          <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-3 text-primary font-bold text-sm tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden">
                            GITHUB
                          </span>
                        </a>
                        <a href="https://linkedin.com/in/karanam-kiran-prasad" target="_blank" rel="noreferrer" className="h-12 flex-1 sm:flex-none min-w-[3rem] px-[12px] rounded-full bg-[#12141c] border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(0,230,57,0.9)] transition-all duration-300 group overflow-hidden">
                          <i className="devicon-linkedin-plain text-2xl text-gray-400 group-hover:text-primary transition-colors"></i>
                          <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-3 text-primary font-bold text-sm tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden">
                            LINKEDIN
                          </span>
                        </a>
                        <a href="mailto:kiranprasadkaranam@gmail.com" className="h-12 flex-1 sm:flex-none min-w-[3rem] px-[12px] rounded-full bg-[#12141c] border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(0,230,57,0.9)] transition-all duration-300 group overflow-hidden">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">mail</span>
                          <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-3 text-primary font-bold text-sm tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden">
                            EMAIL
                          </span>
                        </a>
                      </motion.div>
                    </div>

                    {/* Graphic */}
                    <motion.div variants={fadeUp} className="relative w-full aspect-square flex items-center justify-center mt-12 md:mt-0">
                      <div className="absolute w-[90%] h-[90%] border border-primary/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                      <div className="absolute w-[65%] h-[65%] border border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed"></div>
                      <div className="absolute w-[40%] h-[40%] bg-primary/5 rounded-full shadow-[0_0_100px_rgba(0,230,57,0.3)] backdrop-blur-3xl flex items-center justify-center overflow-hidden border border-primary/30 z-20">
                        <img src="/images/hacker_robot_1782435592072.png" className="w-full h-full object-cover opacity-90" alt="Hacker Robot Avatar" />
                      </div>
                      
                      {/* Outer Ring (90%) - First 4 Skills */}
                      <div className="absolute w-[90%] h-[90%] animate-[spin_60s_linear_infinite] z-10 pointer-events-none">
                        {skillsData.slice(0, 4).map((skill, index) => (
                          <div key={skill.name} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" style={{ transform: `rotate(${index * 90}deg)` }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#12141c] border border-primary/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,230,57,0.2)] overflow-hidden">
                              <div className="w-full h-full animate-[spin_60s_linear_infinite_reverse] flex items-center justify-center bg-[#12141c]">
                                <img src={skill.image} className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt={skill.name} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Inner Ring (65%) - Last 4 Skills */}
                      <div className="absolute w-[65%] h-[65%] animate-[spin_40s_linear_infinite_reverse] z-10 pointer-events-none">
                        {skillsData.slice(4, 8).map((skill, index) => (
                          <div key={skill.name} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" style={{ transform: `rotate(${index * 90 + 45}deg)` }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#12141c] border border-primary/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,230,57,0.2)] overflow-hidden">
                              <div className="w-full h-full animate-[spin_40s_linear_infinite] flex items-center justify-center bg-[#12141c]">
                                 <img src={skill.image} className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt={skill.name} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Social dock removed from here and placed under the CV button */}
                </section>

                {/* ABOUT / INTRODUCTION (Split View) */}
                <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="min-h-[100svh] py-24 flex items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-6 md:px-16 max-w-7xl mx-auto w-full">
                      <motion.div variants={fadeUp} className="flex flex-col gap-6 justify-center relative z-10">
                        <div className="text-primary font-code-sm tracking-widest flex items-center gap-4 text-sm font-semibold">
                          <span>01</span> <span className="w-12 h-px bg-primary/50"></span> <span>INTRODUCTION</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">Re-defining the Ecosystem.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed font-light mt-4">
                            I am a Full Stack Architect driven by the art of possibility. I don't just write code; I design ecosystems. Bridging the gap between raw engineering and intuitive design to solve real-world problems. With experience at Google AI & ML and building robust MERN workflows, I deliver scalable performance.
                        </p>
                        <div className="mt-8 self-start inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 text-white text-sm font-medium tracking-wide">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#00e639] animate-pulse"></div> AVAILABLE FOR WORK
                        </div>
                      </motion.div>
                      <motion.div variants={staggerContainer} className="flex flex-col gap-6 justify-center relative z-10">
                        <motion.div variants={fadeUp} className="p-10 rounded-[2rem] bg-[#12141c] border border-primary/10 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(0,230,57,0.1)] flex flex-col items-center justify-center gap-4 group cursor-default">
                          <span className="material-symbols-outlined text-5xl text-primary/50 group-hover:text-primary transition-colors group-hover:scale-110 duration-500">architecture</span>
                          <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">SYSTEM ARCHITECTURE</div>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-6">
                          <motion.div variants={fadeUp} className="p-8 rounded-[2rem] bg-[#12141c] border border-primary/10 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(0,230,57,0.1)] flex flex-col items-center justify-center gap-3 group cursor-default">
                              <div className="text-4xl md:text-5xl font-black text-white group-hover:text-primary transition-colors">MERN</div>
                              <div className="text-primary text-xs tracking-[0.2em] font-code-sm font-semibold uppercase">Stack Core</div>
                          </motion.div>
                          <motion.div variants={fadeUp} className="p-8 rounded-[2rem] bg-[#12141c] border border-primary/10 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(0,230,57,0.1)] flex flex-col items-center justify-center gap-3 group cursor-default">
                              <div className="text-4xl md:text-5xl font-black text-white group-hover:text-primary transition-colors">AI/ML</div>
                              <div className="text-primary text-xs tracking-[0.2em] font-code-sm font-semibold uppercase">Integration</div>
                          </motion.div>
                        </div>
                      </motion.div>
                  </div>
                </motion.section>

                {/* SKILLS SECTION (The Engineering Core) */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="px-6 md:px-16 max-w-7xl mx-auto w-full text-center mb-16 relative z-10">
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white tracking-tight">The Engineering <span className="text-primary">Core.</span></motion.h2>
                    <motion.p variants={fadeUp} className="text-gray-400 mt-4 max-w-2xl mx-auto">Technologies and languages I use to build scalable, intelligent architectures.</motion.p>
                  </div>
                  <div className="px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {skillsData.map((skill, index) => (
                        <motion.div key={skill.name} variants={fadeUp} className="p-6 rounded-[1.5rem] bg-[#12141c] border border-primary/10 hover:border-primary/40 transition-all duration-300 group flex flex-col items-center text-center cursor-default hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,230,57,0.15)]">
                          <img src={skill.image} alt={skill.name} className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(0,230,57,0.2)] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />
                          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{skill.name}</h3>
                          <p className="text-xs text-primary/70 font-code-sm uppercase tracking-widest mt-2">{skill.category}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* EXPERIENCE SECTION */}
                <motion.section id="experience" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10">
                      <motion.div variants={fadeUp} className="text-primary font-code-sm tracking-widest flex items-center gap-4 text-sm font-semibold mb-16">
                        <span>02</span> <span className="w-12 h-px bg-primary/50"></span> <span>EXPERIENCE</span>
                      </motion.div>
                      
                      <div className="flex flex-col gap-12 border-l-2 border-primary/20 ml-4 md:ml-8 pl-8 md:pl-12 relative">
                        {experienceData.map((exp, index) => (
                           <motion.div key={index} variants={fadeUp} className="relative group">
                              <div className="absolute -left-[41px] md:-left-[57px] top-0 w-5 h-5 rounded-full bg-[#12141c] border-2 border-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(0,230,57,0.5)] transition-all z-10"></div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{exp.role}</h3>
                                  <div className="text-xl text-gray-300 font-medium mt-1">{exp.company}</div>
                                </div>
                                <div className="text-primary/70 font-code-sm text-sm uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/20 self-start">{exp.period}</div>
                              </div>
                              <div className="flex flex-col gap-3 mt-4">
                                {exp.desc.map((bullet, i) => (
                                  <p key={i} className="text-gray-400 leading-relaxed max-w-3xl flex items-start gap-3">
                                    <span className="text-primary mt-1.5 text-[0.5rem]">◆</span>
                                    <span>{bullet}</span>
                                  </p>
                                ))}
                              </div>
                           </motion.div>
                        ))}
                      </div>
                  </div>
                </motion.section>

                {/* ACHIEVEMENTS & PROFILES SECTION */}
                <motion.section id="achievements" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
                      
                      <div className="lg:col-span-7 flex flex-col gap-12">
                        <motion.div variants={fadeUp} className="text-primary font-code-sm tracking-widest flex items-center gap-4 text-sm font-semibold mb-4">
                          <span>03</span> <span className="w-12 h-px bg-primary/50"></span> <span>ACHIEVEMENTS</span>
                        </motion.div>
                        <div className="flex flex-col gap-8">
                          {achievementsData.map((ach, index) => (
                             <motion.div key={index} variants={fadeUp} className="p-8 rounded-[2rem] bg-[#12141c] border border-primary/10 hover:border-primary/40 transition-all duration-300 shadow-xl group">
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{ach.title}</h3>
                                <p className="text-gray-400 mt-3 leading-relaxed">{ach.desc}</p>
                             </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-12">
                        <motion.div variants={fadeUp} className="text-primary font-code-sm tracking-widest flex items-center gap-4 text-sm font-semibold mb-4 lg:justify-end">
                          <span>PROFILES</span> <span className="w-12 h-px bg-primary/50"></span> 
                        </motion.div>
                        <div className="flex flex-col gap-6">
                          {profilesData.map((profile, index) => (
                             <motion.a 
                               href={profile.url} 
                               target="_blank" 
                               rel="noreferrer" 
                               key={index} 
                               variants={fadeUp} 
                               className="p-6 rounded-2xl bg-gradient-to-r from-[#12141c] to-[#0a0c10] border border-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(0,230,57,0.2)] transition-all duration-300 group flex items-center justify-between"
                             >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <span className="material-symbols-outlined text-primary group-hover:text-black transition-colors">{profile.icon}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{profile.name}</h3>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors group-hover:translate-x-1">arrow_forward</span>
                             </motion.a>
                          ))}
                        </div>
                      </div>

                  </div>
                </motion.section>

                {/* SELECTED PROJECTS SECTION */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-32 relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10">
                      <motion.div variants={fadeUp} className="text-primary font-code-sm tracking-widest flex items-center gap-4 text-sm font-semibold mb-16">
                        <span>04</span> <span className="w-12 h-px bg-primary/50"></span> <span>SELECTED PROJECTS</span>
                      </motion.div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Featured Project */}
                        <motion.div onClick={() => setSelectedProject(projectsData[0])} variants={fadeUp} className="lg:col-span-7 rounded-[2.5rem] bg-[#12141c] border border-primary/10 p-8 md:p-12 flex flex-col gap-8 hover:border-primary/40 hover:shadow-[0_0_50px_rgba(0,230,57,0.1)] transition-all duration-500 group relative overflow-hidden block cursor-pointer">
                          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/20 transition-colors duration-700"></div>
                          <div className="flex items-center justify-between z-10 relative">
                              <span className="px-4 py-1.5 rounded-full border border-primary/30 text-xs text-primary font-code-sm font-bold tracking-wider bg-primary/5">FEATURED PROJECT</span>
                              <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors group-hover:scale-110">arrow_outward</span>
                          </div>
                          <h3 className="text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors z-10 relative">{projectsData[0].title}</h3>
                          <div className="w-full aspect-video bg-[#08090b] rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-primary/10 relative z-10 group-hover:border-primary/30 transition-colors">
                              <img src={projectsData[0].image} alt={projectsData[0].title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                          </div>
                          <p className="text-gray-400 text-lg leading-relaxed z-10 relative line-clamp-2">{projectsData[0].desc}</p>
                          <div className="flex gap-3 z-10 relative">
                              {projectsData[0].tags.map(tag => <span key={tag} className="text-xs text-primary font-code-sm px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{tag}</span>)}
                          </div>
                        </motion.div>
                        
                        {/* Right Stack */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            {projectsData.slice(1, 3).map((proj) => (
                              <motion.div key={proj.title} onClick={() => setSelectedProject(proj)} variants={fadeUp} className="flex-1 rounded-[2.5rem] bg-[#12141c] border border-primary/10 p-8 flex flex-col justify-between hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,230,57,0.1)] transition-all duration-500 group relative overflow-hidden block cursor-pointer">
                                <div className="absolute inset-0 z-0">
                                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700" />
                                </div>
                                <div className="flex items-start justify-between relative z-10">
                                  <div className="flex flex-col gap-2 pr-4">
                                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{proj.title}</h3>
                                      <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-2">{proj.desc}</p>
                                  </div>
                                </div>
                                <div className="mt-8 flex gap-2 relative z-10">
                                    {proj.tags.map(tag => <span key={tag} className="text-xs text-primary font-code-sm font-semibold uppercase bg-[#12141c]/80 px-2 py-1 rounded">{tag}</span>)}
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Full Archive Link */}
                      <motion.div variants={fadeUp} className="mt-12 flex justify-end relative z-10">
                        <button onClick={goProjects} className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all font-code-sm font-bold tracking-widest text-sm uppercase bg-[#12141c]">
                            EXPLORE FULL ARCHIVE <span className="material-symbols-outlined text-lg">arrow_outward</span>
                        </button>
                      </motion.div>
                  </div>
                </motion.section>
              </motion.div>
            )}

            {/* PROJECTS ARCHIVE VIEW */}
            {currentView === 'projects' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-40 pb-32 min-h-screen px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">Selected <span className="text-primary">Projects.</span></h1>
                      <p className="text-gray-400 mt-4 max-w-xl">A complete archive of my engineering workflows, ML models, and full-stack applications.</p>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                      {['All', 'Web Dev', 'AI/ML', 'Other'].map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setFilter(cat)}
                          className={`px-6 py-2 rounded-full font-code-sm text-sm tracking-widest uppercase transition-all ${filter === cat ? 'bg-primary text-black font-bold shadow-[0_0_15px_rgba(0,230,57,0.4)]' : 'bg-[#12141c] border border-primary/20 text-gray-400 hover:text-primary hover:border-primary/50'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Projects Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <AnimatePresence>
                     {filteredProjects.map((proj, idx) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          key={proj.title}
                          onClick={() => setSelectedProject(proj)}
                          className="rounded-[2rem] bg-[#12141c] border border-primary/10 p-6 flex flex-col hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,230,57,0.1)] transition-all group cursor-pointer h-full relative overflow-hidden"
                        >
                          <div className="w-full aspect-video rounded-xl bg-black overflow-hidden mb-6 border border-primary/10 relative">
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {proj.tags.map(tag => <span key={tag} className="text-xs text-primary/70 font-code-sm uppercase tracking-widest">{tag}</span>)}
                          </div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors mb-2">{proj.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">{proj.desc}</p>
                          <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
                            <span className="text-primary font-code-sm text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                              View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                          </div>
                        </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
              </motion.div>
            )}

            {/* CONTACT SECTION (Common across views) */}
            <motion.section id="contact" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="py-32 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="px-6 md:px-16 max-w-4xl mx-auto w-full text-center relative z-10">
                 <motion.div variants={fadeUp} className="text-primary font-code-sm tracking-widest flex items-center justify-center gap-4 text-sm font-semibold mb-6">
                    <span>05</span> <span className="w-12 h-px bg-primary/50"></span> <span>CONTACT</span>
                 </motion.div>
                 <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight">
                   Let's Build <span className="text-primary">Something.</span>
                 </motion.h2>
                 <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert('Message transmission initiated.'); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <motion.input variants={fadeUp} required type="text" placeholder="Name" className="w-full bg-[#12141c] border border-primary/20 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                       <motion.input variants={fadeUp} required type="email" placeholder="Email" className="w-full bg-[#12141c] border border-primary/20 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                    </div>
                    <motion.textarea variants={fadeUp} required placeholder="Message" rows="6" className="w-full bg-[#12141c] border border-primary/20 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/50 transition-all font-medium resize-none"></motion.textarea>
                    <motion.div variants={fadeUp} className="mt-4 text-center">
                      <button type="submit" className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,230,57,0.4)] hover:-translate-y-1 transition-all duration-300">
                        Send Message <span className="material-symbols-outlined">send</span>
                      </button>
                    </motion.div>
                 </form>
              </div>
            </motion.section>

          </main>

          {/* FOOTER */}
          <footer className="relative z-20 w-full py-8 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-primary/10 bg-[#05070a]">
            <div onClick={goHome} className="text-primary font-bold text-xl matrix-glow tracking-widest cursor-pointer">KIRAN_OS</div>
            <div className="font-code-sm text-gray-500 text-xs tracking-widest">© {new Date().getFullYear()} KARANAM KIRAN PRASAD. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-6">
              <a className="text-gray-500 hover:text-primary transition-colors text-sm font-medium" href="https://github.com/kkiran47" target="_blank" rel="noreferrer">GitHub</a>
              <a className="text-gray-500 hover:text-primary transition-colors text-sm font-medium" href="https://linkedin.com/in/karanam-kiran-prasad" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="text-gray-500 hover:text-primary transition-colors text-sm font-medium" href="mailto:kiranprasadkaranam@gmail.com">Email</a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
