(() => {
	const html = '<html><head><title>Gulliver Traveller - Roteiros</title></head><body><b>->1 - Roteiros para *São Paulo*</b><br>A Terra da Garoa!<br>Fundada em 25 de janeiro de 1554, a cidade tem hoje cerca de 12 milhões de habitantes e é considerada o centro financeiro do Brasil. Aqui vão três dicas de roteiros obrigatórios para aqueles que passam pela capital paulista<br>#Roteiro A | Região: Avenida Paulista<br>MASP; Parque Trianon; Rua Augusta<br>#Roteiro B | Região: Centro<br>Catedral da Sé; Pátio do Colégio; Rua Augusta<br>#Roteiro C | Região: Vila Madalena<br>Beco do Batman; Feirinha da Benedito Calixto; Livraria da Vila<br> <b>->2 - Roteiros para *Las Vegas*</b><br>Viva Las Vegas!<br>       A cidade mais populosa e mais densamente povoada do estado de Nevada, Las Vegas foi fundada em 1905. É considerada oficialmente como uma cidade desde 1911 e conta com mais de meio milhão de habitantes. Venha conhecer a capital dos jogos de azar!<br>#Roteiro A | Região: Las Vegas Boulevard South<br>Fonte do Bellagio; Principais Cassinos; Madame Tussauds<br>#Roteiro B | Região: Downtown<br>; Fremont; Las Vegas Art Museum; Museu Nacional do Crime Organizado; <br>#Roteiro C | Região: Las Vegas Boulevard North<br>Outlet Premium North; Stratosphere; Apple Fashion Show<br><b>->3 - Roteiros para *Moscou*</b><br>Privet!<br>A capital russa fica situada às margens do Rio Moscou e, apesar de ser a cidade mais cosmopolita da Rússia, grande parte de sua história está preservada<br>#Roteiro A | Região: Praça Vermelha<br>Museu Histórico do Estado; Catedral de São Basílico; Mausoléu de Lênin<br>#Roteiro B | Região: Centro<br>Teatro Bolshoi; Monumento a Karl Marx; Rio Moscou<br>#Roteiro C | Região: Obras pela cidade<br>Metrô de Moscou; As Sete Irmãs; Moscow Leningradsky Railway Station  <br></body></html>';
	console.log('Conteúdo bruto: ', html);

	// ---------- TRATAMENTO DAS INFORMAÇÕES ----------

	const limiteA = '<body>';
	const limiteB = '</body>';
	const bodyContent = html.substring(
		html.indexOf(limiteA) + limiteA.length,
		html.indexOf(limiteB)
	);

	const listaCidades = bodyContent
		.split(/<b>->\d+ - /)
		.filter(cidade => cidade)
		.map(conteudo => {
			const cidade = {};
			let aux;

			cidade.nome = conteudo.substring(
				(aux = conteudo.indexOf('*') + 1),
				conteudo.indexOf('*', aux)
			);

			cidade.roteiros = conteudo
				.substring(conteudo.indexOf('#'))
				.split(/#Roteiro \w+ \| Região: /)
				.filter(roteiro => roteiro)
				.map(texto => {
					const roteiro = {};
					const divisor = '<br>';

					roteiro.regiao = texto.substring(0, texto.indexOf(divisor));
					roteiro.pontosTuristicos = texto
						.substring(
							(aux = texto.indexOf(divisor) + divisor.length),
							texto.indexOf(divisor, aux + 1)
						)
						.split(/\s*;\s*/)
						.filter(lugar => lugar);

					return roteiro;
				})
			;
			
			return cidade;
		})
	;

	console.log('Conteúdo trabalhado:', listaCidades);

	// ---------- REQUISIÇÕES DA ATIVIDADE ----------

	// Requisição 1
	const $cidades = document.getElementById('cidades');
	$cidades.innerHTML = listaCidades
		.map(cidade => cidade.nome)
		.join(', ')
		.replace(/, ([^,]+)$/, ' e $1')
		.concat('.')	
	;

	// Requisição 2 e 3
	const $roteiros = document.getElementById('roteiros');
	const $ul = document.createElement('ul');

	listaCidades.forEach(cidade => {
		const $li = document.createElement('li');
		const roteiroA = cidade.roteiros[0];

		$li.innerHTML = `Região: ${
			roteiroA.regiao
		} -> ${
			roteiroA.pontosTuristicos.join('; ')
		} (${
			roteiroA.pontosTuristicos.length
		} locais)`;

		$ul.appendChild($li);
	});
	$roteiros.appendChild($ul);

	// Requisição 4
	const $sp = document.getElementById('sp');
	$sp.innerHTML = listaCidades
		.find(cidade => cidade.nome == 'São Paulo')
		.roteiros
		.find(roteiro => roteiro.regiao == 'Centro')
		.pontosTuristicos
		.join(', ')
		.replace(/, ([^,]+)$/, ' e $1')
		.concat('.')
	;

	// Requisição 5
	const $la = document.getElementById('la');
	$la.innerHTML = listaCidades
		.find(cidade => cidade.nome == 'Las Vegas')
		.roteiros
		.find(roteiro => roteiro.regiao == 'Downtown')
		.pontosTuristicos
		.join(', ')
		.replace(/, ([^,]+)$/, ' e $1')
		.concat('.')
	;

	// -------- EXIBIR INFORMAÇÕES ---------

	const $tabela = document.getElementById('tabela');
	const $data = $tabela.tBodies[0];

	listaCidades.forEach(cidade => {
		const primeiraLinhaCidade = $data.childElementCount;

		cidade.roteiros.forEach(roteiro => {
			const primeiraLinhaRoteiro = $data.childElementCount;

			// Cria uma linha da tabela para cada ponto turístico
			roteiro.pontosTuristicos.forEach(lugar => {
				const $tr = document.createElement('tr');
				const $td = document.createElement('td');
				$td.innerHTML = lugar;

				$tr.appendChild($td);
				$data.appendChild($tr);
			});

			// Adiciona a célula para o nome da região na primeira linha correspondente
			const $td = document.createElement('td');
			$td.innerHTML = roteiro.regiao;
			$td.rowSpan   = roteiro.pontosTuristicos.length;

			const $tr = $data.children[primeiraLinhaRoteiro];
			$tr.insertBefore($td, $tr.children[0]);
		});

		// Adiciona a célula para o nome da cidade na primeira linha correspondente
		const $td = document.createElement('td');
		$td.innerHTML = cidade.nome;
		$td.rowSpan   = $data.childElementCount - primeiraLinhaCidade;

		const $tr = $data.children[primeiraLinhaCidade];
		$tr.insertBefore($td, $tr.children[0]);
	});
})();