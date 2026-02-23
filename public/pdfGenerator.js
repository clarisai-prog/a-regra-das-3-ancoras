/**
 * PDF Generator Module - Lazy Loaded
 * Gera PDF do guia de oracoes das 3 Ancoras
 */

const PdfGenerator = {
  JSPDF_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  isLoading: false,
  isLoaded: false,
  
  loadLibrary() {
    return new Promise((resolve, reject) => {
      if (window.jspdf?.jsPDF) {
        this.isLoaded = true;
        resolve(window.jspdf.jsPDF);
        return;
      }
      
      if (this.isLoading) {
        const check = setInterval(() => {
          if (window.jspdf?.jsPDF) {
            clearInterval(check);
            this.isLoaded = true;
            resolve(window.jspdf.jsPDF);
          }
        }, 100);
        return;
      }
      
      this.isLoading = true;
      const script = document.createElement('script');
      script.src = this.JSPDF_URL;
      script.async = true;
      script.onload = () => {
        this.isLoading = false;
        this.isLoaded = true;
        resolve(window.jspdf.jsPDF);
      };
      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Falha ao carregar jsPDF'));
      };
      document.head.appendChild(script);
    });
  },
  
  getContent() {
    return {
      title: 'A Regra das 3 Ancoras',
      subtitle: 'Guia de Oracoes Diarias',
      chapters: [
        {
          title: 'Ancora da Manha (O Despertar na Graca)',
          verse: '"Faze-me ouvir do teu amor leal pela manha, pois em ti confio." (Salmo 143, 8)',
          prayers: [
            {
              title: 'Versao 2 Minutos - Oracao de Oferecimento',
              text: '"Senhor, no silencio deste dia que amanhece, eu Te entrego o meu cansaco, os meus medos e as minhas expectativas. Liberta-me da necessidade de ser perfeito hoje. Que eu caminhe amparado pela Tua graca, oferecendo o meu trabalho, a minha familia e as minhas fragilidades ao Teu cuidado amoroso. Amem."'
            },
            {
              title: 'Versao 7 Minutos',
              text: '1. Faca a Oracao de Oferecimento\n2. Leia lentamente o Salmo 23\n3. Termine com 1 minuto de silencio absoluto'
            }
          ]
        },
        {
          title: 'Ancora do Meio-Dia (A Pausa do Descanso)',
          verse: '"Orem continuamente. Deem gracas em todas as circunstancias." (1 Tessalonicenses 5, 17-18)',
          prayers: [
            {
              title: 'Versao 1 Minuto - A Jaculatoria de Alivio',
              text: '"Jesus, manso e humilde de coracao, fazei o meu coracao semelhante ao Vosso. Que no meio da agitacao e do barulho destas horas, eu encontre descanso imediato na Tua graca."'
            },
            {
              title: 'Versao 5 Minutos',
              text: '1. Reza a Jaculatoria\n2. Leia um versiculo do Evangelho do Dia\n3. Se a manha foi dificil, nao se condene'
            }
          ]
        },
        {
          title: 'Ancora da Noite (O Pouso Seguro)',
          verse: '"Gracas ao grande amor do Senhor e que nao somos consumidos." (Lamentacoes 3, 22-23)',
          prayers: [
            {
              title: 'Versao 2 Minutos - Ato de Contricao Curativo',
              text: '"Meu Deus, eu Te agradeco por ter me sustentado ate aqui. Peco perdao com o coracao tranquilo pelas vezes em que tropecei, perdi a paciencia ou duvidei do Teu cuidado hoje. Eu nao me escondo na culpa; eu me lanco agora na Tua infinita misericordia, sabendo que o Teu perdao me abraca. Amem."'
            },
            {
              title: 'Versao 7 Minutos - Exame de Consciencia Gentil',
              text: 'Refleta sem peso sobre estas 3 perguntas:\n\n1. Onde eu percebi um pequeno cuidado de Deus por mim hoje?\n2. Em qual momento do dia eu deixei a ansiedade roubar minha paz?\n3. Como posso recomecar amanha de forma mais leve?'
            }
          ]
        }
      ],
      closing: 'Que a graca do Senhor Jesus Cristo, o amor de Deus e a comunhao do Espirito Santo estejam com voce. (2 Corintios 13, 13)'
    };
  },
  
  async generate(onProgress = () => {}, onComplete = () => {}, onError = () => {}) {
    try {
      onProgress({ status: 'loading', message: 'Carregando biblioteca...' });
      const { jsPDF } = await this.loadLibrary();
      
      onProgress({ status: 'generating', message: 'Gerando PDF...' });
      
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const content = this.getContent();
      let yPos = 20;
      const margin = 20;
      const pageHeight = 280;
      
      doc.setFont('helvetica');
      
      // Titulo
      doc.setFontSize(20);
      doc.setTextColor(198, 168, 124);
      doc.text(content.title, margin, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(content.subtitle, margin, yPos);
      yPos += 15;
      
      doc.setDrawColor(198, 168, 124);
      doc.line(margin, yPos, 190, yPos);
      yPos += 10;
      
      // Capitulos
      content.chapters.forEach((chapter, idx) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(`Capitulo ${idx + 1}: ${chapter.title}`, margin, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, 'italic');
        const verseLines = doc.splitTextToSize(chapter.verse, 170);
        doc.text(verseLines, margin, yPos);
        yPos += verseLines.length * 4 + 6;
        
        doc.setFont(undefined, 'normal');
        chapter.prayers.forEach(prayer => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(11);
          doc.setTextColor(198, 168, 124);
          doc.setFont(undefined, 'bold');
          doc.text(prayer.title, margin, yPos);
          yPos += 6;
          
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.setFont(undefined, 'normal');
          const textLines = doc.splitTextToSize(prayer.text, 170);
          doc.text(textLines, margin, yPos);
          yPos += textLines.length * 5 + 8;
        });
        
        yPos += 5;
      });
      
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setDrawColor(198, 168, 124);
      doc.line(margin, yPos, 190, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'italic');
      const closingLines = doc.splitTextToSize(content.closing, 170);
      doc.text(closingLines, margin, yPos);
      
      const filename = `3-ancoras-guia-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      onComplete({ filename });
    } catch (error) {
      console.error('Erro:', error);
      onError(error.message || 'Erro desconhecido');
    }
  }
};

window.PdfGenerator = PdfGenerator;
